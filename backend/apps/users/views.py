import uuid

from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.utils.text import slugify
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from .emails import send_password_reset_email, send_verification_email
from .models import SocialAccount
from .serializers import (
    CustomTokenObtainPairSerializer,
    EmailVerificationSerializer,
    PasswordResetConfirmSerializer,
    PasswordResetRequestSerializer,
    RegisterSerializer,
    UserSerializer,
)
from .social import verify_github_code, verify_google_id_token

User = get_user_model()


def _unique_username_from(seed: str) -> str:
    base = slugify(seed).replace("-", "")[:24] or "user"
    candidate = base
    suffix = 0
    while User.objects.filter(username__iexact=candidate).exists():
        suffix += 1
        candidate = f"{base}{suffix}"
    return candidate


def _get_or_create_social_user(provider: str, profile) -> User:
    social_account = (
        SocialAccount.objects.filter(provider=provider, provider_uid=profile.provider_uid)
        .select_related("user")
        .first()
    )
    if social_account:
        return social_account.user

    user = User.objects.filter(email__iexact=profile.email).first()
    if not user:
        user = User.objects.create_user(
            email=profile.email,
            username=_unique_username_from(profile.email.split("@")[0]),
            full_name=profile.full_name,
            avatar_url=profile.avatar_url,
            is_email_verified=True,  # OAuth providers already verified the email
        )
        user.set_unusable_password()
        user.save(update_fields=["password"])

    SocialAccount.objects.create(
        id=uuid.uuid4(), user=user, provider=provider, provider_uid=profile.provider_uid
    )
    return user


def _issue_tokens_for(user) -> dict:
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": UserSerializer(user).data,
    }


class RegisterView(generics.CreateAPIView):
    """POST /api/v1/auth/register/ -- creates an unverified account and emails a verification link."""

    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        send_verification_email(user)
        return Response(
            {"detail": "Account created. Check your email to verify your address."},
            status=status.HTTP_201_CREATED,
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    """POST /api/v1/auth/login/ -- email+password login, returns access+refresh+user."""

    serializer_class = CustomTokenObtainPairSerializer
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]


class LogoutView(APIView):
    """POST /api/v1/auth/logout/ -- blacklists the given refresh token."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data["refresh"])
            token.blacklist()
        except Exception:
            return Response({"detail": "Invalid or already-expired token."}, status=400)
        return Response(status=status.HTTP_205_RESET_CONTENT)


class VerifyEmailView(APIView):
    """POST /api/v1/auth/verify-email/ -- consumes {uid, token} from the emailed link."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        user.is_email_verified = True
        user.save(update_fields=["is_email_verified"])
        return Response({"detail": "Email verified successfully."})


class ResendVerificationEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        if request.user.is_email_verified:
            return Response({"detail": "Email is already verified."}, status=400)
        send_verification_email(request.user)
        return Response({"detail": "Verification email sent."})


class PasswordResetRequestView(APIView):
    """POST /api/v1/auth/password-reset/ -- always returns 200 to avoid leaking which emails exist."""

    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.filter(email__iexact=serializer.validated_data["email"]).first()
        if user:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            send_password_reset_email(user, uid, token)

        return Response({"detail": "If that email exists, a reset link has been sent."})


class PasswordResetConfirmView(APIView):
    """POST /api/v1/auth/password-reset/confirm/ -- consumes {uid, token, new_password}."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"detail": "Password reset successfully. Log in with your new password."})


class SocialLoginView(APIView):
    """
    POST /api/v1/auth/social/<provider>/
    Google: body {"id_token": "..."} from Google Identity Services on the frontend.
    GitHub: body {"code": "..."} from the OAuth redirect callback.
    Returns the same {access, refresh, user} shape as normal login.
    """

    permission_classes = [permissions.AllowAny]
    throttle_scope = "auth"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request, provider):
        if provider == "google":
            id_token = request.data.get("id_token")
            if not id_token:
                return Response({"detail": "id_token is required."}, status=400)
            profile = verify_google_id_token(id_token)
        elif provider == "github":
            code = request.data.get("code")
            if not code:
                return Response({"detail": "code is required."}, status=400)
            profile = verify_github_code(code)
        else:
            return Response({"detail": "Unsupported provider."}, status=400)

        user = _get_or_create_social_user(provider, profile)
        return Response(_issue_tokens_for(user))


class MeView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/v1/auth/me/ -- the logged-in user's own profile."""

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
