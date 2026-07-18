"""URL routes for the Project Management module.

Exposes:
    /api/v1/projects/           -> list, create
    /api/v1/projects/{id}/      -> retrieve, partial_update, destroy

Wire this into the project's root urls.py (not modified here, per scope):

    from django.urls import include, path

    urlpatterns = [
        ...
        path("api/v1/", include("projects.urls")),
    ]
"""

from rest_framework.routers import DefaultRouter

from .views import ProjectViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="project")

urlpatterns = router.urls
