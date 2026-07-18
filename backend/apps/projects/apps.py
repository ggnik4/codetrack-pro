from django.apps import AppConfig


class ProjectsConfig(AppConfig):
    """App configuration for the Project Management module."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.projects"
    verbose_name = "Project Management"
