import uuid

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    """Users log in with email, not username."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_email_verified", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user. Kept intentionally lean -- platform-specific data (Codeforces
    handle, LeetCode username, ratings) lives in apps.accounts, not here, so
    this model never needs to change when a new platform is added.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=150, blank=True)
    username = models.SlugField(
        max_length=32,
        unique=True,
        help_text="Public handle used in profile URLs, e.g. /u/<username>.",
    )

    avatar_url = models.URLField(blank=True)
    bio = models.CharField(max_length=280, blank=True)
    college_or_organization = models.CharField(max_length=150, blank=True)
    timezone = models.CharField(max_length=64, default="Asia/Kolkata")

    is_email_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        db_table = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email


class SocialAccount(models.Model):
    """
    Minimal local record of a linked OAuth identity (Google/GitHub). Kept
    separate from allauth's own SocialAccount table so our API layer has a
    stable, minimal shape to serialize regardless of allauth internals.
    """

    class Provider(models.TextChoices):
        GOOGLE = "google", "Google"
        GITHUB = "github", "GitHub"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="social_accounts")
    provider = models.CharField(max_length=20, choices=Provider.choices)
    provider_uid = models.CharField(max_length=255)
    connected_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_social_accounts"
        constraints = [
            models.UniqueConstraint(
                fields=["provider", "provider_uid"], name="unique_provider_identity"
            )
        ]

    def __str__(self):
        return f"{self.user.email} - {self.provider}"
