from django.conf import settings
from django.core.mail import send_mail
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode

from .tokens import email_verification_token


def _frontend_url(path: str) -> str:
    base = getattr(settings, "FRONTEND_URL", "http://localhost:3000")
    return f"{base.rstrip('/')}{path}"


def send_verification_email(user) -> None:
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = email_verification_token.make_token(user)
    link = _frontend_url(f"/verify-email?uid={uid}&token={token}")

    send_mail(
        subject="Verify your CodeTrack Pro email",
        message=(
            f"Hi {user.full_name or user.username},\n\n"
            f"Confirm your email address to activate your account:\n{link}\n\n"
            "If you didn't create this account, ignore this email."
        ),
        from_email=None,
        recipient_list=[user.email],
    )


def send_password_reset_email(user, uid: str, token: str) -> None:
    link = _frontend_url(f"/reset-password?uid={uid}&token={token}")

    send_mail(
        subject="Reset your CodeTrack Pro password",
        message=(
            f"Hi {user.full_name or user.username},\n\n"
            f"Reset your password here:\n{link}\n\n"
            "If you didn't request this, ignore this email -- your password won't change."
        ),
        from_email=None,
        recipient_list=[user.email],
    )
