from django.contrib import admin

from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "owner", "visibility", "created_at")
    list_filter = ("visibility", "created_at")
    search_fields = ("name", "slug", "owner__username", "owner__email")
    readonly_fields = ("id", "slug", "created_at", "updated_at")
    ordering = ("-created_at",)
