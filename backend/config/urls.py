from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

api_v1_patterns = [
    path("auth/", include("apps.users.urls")),
    path("accounts/", include("apps.accounts.urls")),
    path("contests/", include("apps.contests.urls")),
    path("problems/", include("apps.problems.urls")),
    path("submissions/", include("apps.submissions.urls")),
    path("goals/", include("apps.goals.urls")),
    path("journal/", include("apps.journal.urls")),
    path("friends/", include("apps.friends.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("hackathons/", include("apps.hackathons.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(api_v1_patterns)),
    # OpenAPI schema + docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]
