import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Project",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                        help_text="Unique identifier for the project.",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        max_length=100,
                        help_text="Human readable project name. Not required to be unique.",
                    ),
                ),
                (
                    "slug",
                    models.SlugField(
                        blank=True,
                        max_length=140,
                        unique=True,
                        help_text="URL-safe identifier auto-generated from the name.",
                    ),
                ),
                ("description", models.TextField(blank=True, null=True)),
                (
                    "color",
                    models.CharField(
                        blank=True,
                        max_length=7,
                        null=True,
                        help_text="Hex color code used for UI theming, e.g. '#FF5733'.",
                    ),
                ),
                (
                    "visibility",
                    models.CharField(
                        choices=[("PRIVATE", "Private"), ("PUBLIC", "Public")],
                        default="PRIVATE",
                        max_length=10,
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "owner",
                    models.ForeignKey(
                        help_text="The user who created and owns this project.",
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="projects",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "verbose_name": "Project",
                "verbose_name_plural": "Projects",
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["owner", "created_at"], name="proj_owner_created_idx"),
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["slug"], name="proj_slug_idx"),
        ),
        migrations.AddIndex(
            model_name="project",
            index=models.Index(fields=["visibility"], name="proj_visibility_idx"),
        ),
    ]
