"""Custom permission classes for the Project Management module."""

from rest_framework import permissions
from rest_framework.request import Request
from rest_framework.views import APIView

from .models import Project


class IsOwnerOrReadOnlyOwned(permissions.BasePermission):
    """
    Permission rules for the Project resource.

    - Any authenticated user may list their own projects and create new ones.
    - Only the project's `owner` may retrieve, update, or delete a specific
      project instance.

    Note: the viewset's `get_queryset()` already scopes results to
    `owner=request.user`, so a non-owner requesting a detail/update/delete
    endpoint will typically receive a 404 (object not found in their
    queryset) rather than a 403. `has_object_permission` is kept as a
    defense-in-depth safeguard in case the queryset scoping is ever changed.
    """

    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request: Request, view: APIView, obj: Project) -> bool:
        return obj.owner_id == request.user.id
