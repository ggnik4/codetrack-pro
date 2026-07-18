"""API views for the Project Management module."""

from __future__ import annotations

from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (
    OpenApiExample,
    OpenApiParameter,
    extend_schema,
    extend_schema_view,
)
from rest_framework import filters, permissions, status, viewsets
from rest_framework.pagination import PageNumberPagination
from rest_framework.request import Request
from rest_framework.response import Response

from .filters import ProjectFilter
from .models import Project
from .permissions import IsOwnerOrReadOnlyOwned
from .serializers import ProjectCreateSerializer, ProjectSerializer, ProjectUpdateSerializer

PROJECT_RESPONSE_EXAMPLE = {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "CodeTrack Backend Revamp",
    "slug": "codetrack-backend-revamp",
    "description": "Rework the API layer for v2.",
    "color": "#4F46E5",
    "visibility": "PRIVATE",
    "owner": "9c858901-8a57-4791-81fe-4c455b099bc9",
    "owner_username": "jane.doe",
    "created_at": "2026-07-17T09:30:00Z",
    "updated_at": "2026-07-17T09:30:00Z",
}


class ProjectPagination(PageNumberPagination):
    """Default page size of 20, overridable via `?page_size=` up to 100."""

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


@extend_schema_view(
    list=extend_schema(
        summary="List my projects",
        description=(
            "Returns a paginated list of projects owned by the authenticated user. "
            "Supports free-text search on `name`, ordering by `created_at` or `name`, "
            "and filtering by `visibility`."
        ),
        parameters=[
            OpenApiParameter(name="search", type=str, required=False, description="Search by project name."),
            OpenApiParameter(
                name="ordering",
                type=str,
                required=False,
                description="Order results, e.g. `created_at`, `-created_at`, `name`, `-name`.",
            ),
            OpenApiParameter(
                name="visibility",
                type=str,
                required=False,
                description="Filter by visibility: `PRIVATE` or `PUBLIC`.",
            ),
            OpenApiParameter(name="page", type=int, required=False, description="Page number."),
            OpenApiParameter(name="page_size", type=int, required=False, description="Items per page (default 20, max 100)."),
        ],
        examples=[OpenApiExample("List item example", value=PROJECT_RESPONSE_EXAMPLE, response_only=True)],
    ),
    retrieve=extend_schema(
        summary="Retrieve a project",
        description="Returns a single project owned by the authenticated user.",
        examples=[OpenApiExample("Project detail example", value=PROJECT_RESPONSE_EXAMPLE, response_only=True)],
    ),
    create=extend_schema(
        summary="Create a project",
        description="Creates a new project. The authenticated user is automatically set as the owner.",
        request=ProjectCreateSerializer,
        examples=[
            OpenApiExample(
                "Create request example",
                value={
                    "name": "CodeTrack Backend Revamp",
                    "description": "Rework the API layer for v2.",
                    "color": "#4F46E5",
                    "visibility": "PRIVATE",
                },
                request_only=True,
            ),
            OpenApiExample("Create response example", value=PROJECT_RESPONSE_EXAMPLE, response_only=True),
        ],
    ),
    partial_update=extend_schema(
        summary="Update a project",
        description="Partially updates a project. Only the project owner may perform this action.",
        request=ProjectUpdateSerializer,
        examples=[
            OpenApiExample("Update request example", value={"name": "Renamed Project"}, request_only=True),
            OpenApiExample("Update response example", value=PROJECT_RESPONSE_EXAMPLE, response_only=True),
        ],
    ),
    destroy=extend_schema(
        summary="Delete a project",
        description="Permanently deletes a project. Only the project owner may perform this action.",
    ),
)
class ProjectViewSet(viewsets.ModelViewSet):
    """
    CRUD API for the Project resource.

    Permissions:
        - Authenticated users may create projects and list/view their own.
        - Only the project owner may update (PATCH) or delete a project.

    Note: `PUT` (full update) is intentionally disabled — only `PATCH`
    (partial update) is supported, matching the requirement spec.
    """

    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnlyOwned]
    pagination_class = ProjectPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProjectFilter
    search_fields = ["name"]
    ordering_fields = ["created_at", "name"]
    ordering = ["-created_at"]
    http_method_names = ["get", "post", "patch", "delete", "head", "options"]
    lookup_field = "pk"

    def get_queryset(self):
        """Scope results to projects owned by the requesting user."""
        return (
            Project.objects.select_related("owner")
            .filter(owner=self.request.user)
        )

    def get_serializer_class(self):
        if self.action == "create":
            return ProjectCreateSerializer
        if self.action == "partial_update":
            return ProjectUpdateSerializer
        return ProjectSerializer

    @transaction.atomic
    def create(self, request: Request, *args, **kwargs) -> Response:
        """Validate input via `ProjectCreateSerializer`, then respond with the full `ProjectSerializer` shape."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(owner=request.user)
        output = ProjectSerializer(instance, context=self.get_serializer_context())
        headers = self.get_success_headers(output.data)
        return Response(output.data, status=status.HTTP_201_CREATED, headers=headers)

    @transaction.atomic
    def partial_update(self, request: Request, *args, **kwargs) -> Response:
        """Validate input via `ProjectUpdateSerializer`, then respond with the full `ProjectSerializer` shape."""
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_instance = serializer.save()
        output = ProjectSerializer(updated_instance, context=self.get_serializer_context())
        return Response(output.data, status=status.HTTP_200_OK)

    def perform_destroy(self, instance: Project) -> None:
        with transaction.atomic():
            instance.delete()
