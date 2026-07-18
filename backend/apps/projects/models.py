"""Data models for the Project Management module."""

import uuid

from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Project(models.Model):
    """
    Represents a single project owned by a user.

    A project name may repeat across different owners, but the auto-generated
    `slug` is always globally unique (a numeric suffix is appended on
    collision). Only the `owner` may update or delete a project — enforced at
    the permission layer, see `projects.permissions.IsOwnerOrReadOnlyOwned`.
    """

    class Visibility(models.TextChoices):
        PRIVATE = "PRIVATE", "Private"
        PUBLIC = "PUBLIC", "Public"

    class Status(models.TextChoices):
        PLANNING = "PLANNING", "Planning"
        IN_PROGRESS = "IN_PROGRESS", "In Progress"
        ON_HOLD = "ON_HOLD", "On Hold"
        COMPLETED = "COMPLETED", "Completed"
        ARCHIVED = "ARCHIVED", "Archived"

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the project.",
    )
    name = models.CharField(
        max_length=100,
        help_text="Human readable project name. Not required to be unique.",
    )
    slug = models.SlugField(
        max_length=140,
        unique=True,
        blank=True,
        help_text="URL-safe identifier auto-generated from the name.",
    )
    description = models.TextField(blank=True, null=True)
    color = models.CharField(
        max_length=7,
        blank=True,
        null=True,
        help_text="Hex color code used for UI theming, e.g. '#FF5733'.",
    )
    visibility = models.CharField(
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.PRIVATE,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PLANNING,
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects",
        help_text="The user who created and owns this project.",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["owner", "created_at"], name="proj_owner_created_idx"),
            models.Index(fields=["slug"], name="proj_slug_idx"),
            models.Index(fields=["visibility"], name="proj_visibility_idx"),
        ]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self) -> str:
        return f"{self.name} ({self.owner_id})"

    def save(self, *args, **kwargs) -> None:
        """Auto-generate a unique slug from `name` on first save."""
        if not self.slug:
            self.slug = self._generate_unique_slug()
        super().save(*args, **kwargs)

    def _generate_unique_slug(self) -> str:
        """Build a unique slug, appending a numeric suffix on collision."""
        base_slug = slugify(self.name)[:120] or "project"
        slug = base_slug
        counter = 1
        while Project.objects.filter(slug=slug).exclude(pk=self.pk).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
        return slug
