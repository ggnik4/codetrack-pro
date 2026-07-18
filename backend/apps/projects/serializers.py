"""DRF serializers for the Project Management module."""

from __future__ import annotations

from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    """Full read representation of a Project, used for list/retrieve/response payloads."""

    owner_username = serializers.CharField(source="owner.username", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "color",
            "visibility",
            "owner",
            "owner_username",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "slug", "owner", "created_at", "updated_at"]


class ProjectCreateSerializer(serializers.ModelSerializer):
    """Write-only serializer used for project creation. `owner` is assigned server-side."""

    class Meta:
        model = Project
        fields = ["name", "description", "color", "visibility"]

    def validate_name(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Project name cannot be empty.")
        if len(value) > 100:
            raise serializers.ValidationError("Project name must not exceed 100 characters.")
        return value

    def validate_color(self, value: str | None) -> str | None:
        if value and not value.startswith("#"):
            raise serializers.ValidationError("Color must be a hex code starting with '#', e.g. '#FF5733'.")
        return value


class ProjectUpdateSerializer(serializers.ModelSerializer):
    """Write-only serializer used for partial updates. All fields optional; owner is immutable."""

    class Meta:
        model = Project
        fields = ["name", "description", "color", "visibility"]
        extra_kwargs = {
            "name": {"required": False},
            "description": {"required": False},
            "color": {"required": False},
            "visibility": {"required": False},
        }

    def validate_name(self, value: str) -> str:
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Project name cannot be empty.")
        if len(value) > 100:
            raise serializers.ValidationError("Project name must not exceed 100 characters.")
        return value

    def validate_color(self, value: str | None) -> str | None:
        if value and not value.startswith("#"):
            raise serializers.ValidationError("Color must be a hex code starting with '#', e.g. '#FF5733'.")
        return value
