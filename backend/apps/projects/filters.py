"""Filtering support for the Project Management module (requires django-filter)."""

import django_filters

from .models import Project


class ProjectFilter(django_filters.FilterSet):
    """Supports `?visibility=PRIVATE` / `?visibility=PUBLIC` query filtering."""

    visibility = django_filters.ChoiceFilter(choices=Project.Visibility.choices)
    status = django_filters.ChoiceFilter(choices=Project.Status.choices)

    class Meta:
        model = Project
        fields = ["visibility", "status"]
