from django.contrib.auth.tokens import PasswordResetTokenGenerator


class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    """
    Reuses Django's HMAC token machinery but salts the hash with the user's
    current verification state, so a token becomes invalid the moment the
    email is verified (mirrors how password-reset tokens invalidate on
    password change).
    """

    def _make_hash_value(self, user, timestamp):
        return f"{user.pk}{user.is_email_verified}{timestamp}"


email_verification_token = EmailVerificationTokenGenerator()
