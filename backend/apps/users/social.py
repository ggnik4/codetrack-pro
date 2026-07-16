"""
Verifies OAuth identities from the frontend and returns normalized profile
data. Kept as small, swappable functions rather than classes -- there are
only two providers today and django-allauth's provider registry already
exists in INSTALLED_APPS if this needs to grow into something heavier later.
"""
from dataclasses import dataclass

import httpx
from django.conf import settings
from rest_framework.exceptions import ValidationError


@dataclass
class SocialProfile:
    provider_uid: str
    email: str
    full_name: str
    avatar_url: str = ""


def verify_google_id_token(id_token: str) -> SocialProfile:
    """
    The frontend uses Google Identity Services, which returns a signed ID
    token directly (no server-side code exchange needed for Google).
    """
    resp = httpx.get(
        "https://oauth2.googleapis.com/tokeninfo",
        params={"id_token": id_token},
        timeout=10,
    )
    if resp.status_code != 200:
        raise ValidationError("Invalid Google ID token.")

    data = resp.json()
    expected_client_id = getattr(settings, "GOOGLE_OAUTH_CLIENT_ID", "")
    if expected_client_id and data.get("aud") != expected_client_id:
        raise ValidationError("Google token was not issued for this application.")

    return SocialProfile(
        provider_uid=data["sub"],
        email=data["email"],
        full_name=data.get("name", ""),
        avatar_url=data.get("picture", ""),
    )


def verify_github_code(code: str) -> SocialProfile:
    """
    GitHub's OAuth flow returns an authorization `code` that must be
    exchanged server-side (using the client secret) for an access token.
    """
    token_resp = httpx.post(
        "https://github.com/login/oauth/access_token",
        data={
            "client_id": settings.GITHUB_OAUTH_CLIENT_ID,
            "client_secret": settings.GITHUB_OAUTH_CLIENT_SECRET,
            "code": code,
        },
        headers={"Accept": "application/json"},
        timeout=10,
    )
    if token_resp.status_code != 200 or "access_token" not in token_resp.json():
        raise ValidationError("Invalid GitHub authorization code.")

    access_token = token_resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/json"}

    user_resp = httpx.get("https://api.github.com/user", headers=headers, timeout=10)
    if user_resp.status_code != 200:
        raise ValidationError("Could not fetch GitHub profile.")
    user_data = user_resp.json()

    email = user_data.get("email")
    if not email:
        emails_resp = httpx.get("https://api.github.com/user/emails", headers=headers, timeout=10)
        if emails_resp.status_code == 200:
            primary = next(
                (e for e in emails_resp.json() if e.get("primary") and e.get("verified")), None
            )
            email = primary["email"] if primary else None

    if not email:
        raise ValidationError("GitHub account has no accessible verified email.")

    return SocialProfile(
        provider_uid=str(user_data["id"]),
        email=email,
        full_name=user_data.get("name") or user_data.get("login", ""),
        avatar_url=user_data.get("avatar_url", ""),
    )
