"""Tests for the Project Management module.

Run with:
    python manage.py test projects
"""

from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Project

User = get_user_model()

PROJECTS_URL = "/api/v1/projects/"


def detail_url(project_id) -> str:
    return f"{PROJECTS_URL}{project_id}/"


class ProjectAPITestCase(APITestCase):
    """Covers creation, auth boundaries, ownership rules, pagination, and search."""

    def setUp(self) -> None:
        self.owner = User.objects.create_user(
            username="owner", email="owner@example.com", password="StrongPass123!"
        )
        self.other_user = User.objects.create_user(
            username="other", email="other@example.com", password="StrongPass123!"
        )
        self.project = Project.objects.create(name="Owner Project", owner=self.owner)

    def authenticate_as(self, user) -> None:
        token = RefreshToken.for_user(user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token.access_token}")

    # ---- Creation -----------------------------------------------------

    def test_create_project_success(self) -> None:
        self.authenticate_as(self.owner)
        payload = {
            "name": "New Project",
            "description": "A cool project",
            "color": "#123456",
            "visibility": "PUBLIC",
        }
        response = self.client.post(PROJECTS_URL, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], "New Project")
        self.assertTrue(response.data["slug"])
        self.assertEqual(response.data["visibility"], "PUBLIC")
        self.assertTrue(Project.objects.filter(name="New Project", owner=self.owner).exists())

    def test_create_project_defaults_visibility_to_private(self) -> None:
        self.authenticate_as(self.owner)
        response = self.client.post(PROJECTS_URL, {"name": "Default Vis"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["visibility"], "PRIVATE")

    def test_create_project_requires_name(self) -> None:
        self.authenticate_as(self.owner)
        response = self.client.post(PROJECTS_URL, {"description": "no name"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_duplicate_project_names_allowed_across_users(self) -> None:
        self.authenticate_as(self.other_user)
        response = self.client.post(PROJECTS_URL, {"name": "Owner Project"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertNotEqual(response.data["slug"], self.project.slug)

    # ---- Unauthorized access ------------------------------------------

    def test_create_project_unauthenticated(self) -> None:
        response = self.client.post(PROJECTS_URL, {"name": "X"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_projects_unauthenticated(self) -> None:
        response = self.client.get(PROJECTS_URL)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    # ---- Update ---------------------------------------------------------

    def test_update_by_owner_succeeds(self) -> None:
        self.authenticate_as(self.owner)
        response = self.client.patch(detail_url(self.project.id), {"name": "Updated Name"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, "Updated Name")

    def test_update_by_non_owner_returns_404(self) -> None:
        # Non-owners cannot see the project at all: it is excluded from their
        # queryset, so DRF resolves this as a 404 rather than a 403.
        self.authenticate_as(self.other_user)
        response = self.client.patch(detail_url(self.project.id), {"name": "Hacked"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, "Owner Project")

    # ---- Delete ---------------------------------------------------------

    def test_delete_by_owner_succeeds(self) -> None:
        self.authenticate_as(self.owner)
        response = self.client.delete(detail_url(self.project.id))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(id=self.project.id).exists())

    def test_delete_by_non_owner_returns_404(self) -> None:
        self.authenticate_as(self.other_user)
        response = self.client.delete(detail_url(self.project.id))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertTrue(Project.objects.filter(id=self.project.id).exists())

    # ---- Pagination -------------------------------------------------------

    def test_pagination_default_page_size(self) -> None:
        self.authenticate_as(self.owner)
        Project.objects.bulk_create(
            [Project(name=f"Bulk Project {i}", owner=self.owner) for i in range(25)]
        )

        response = self.client.get(PROJECTS_URL)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 20)
        self.assertIsNotNone(response.data["next"])
        self.assertEqual(response.data["count"], 26)  # 25 bulk + 1 from setUp

    # ---- Search -------------------------------------------------------

    def test_search_by_name(self) -> None:
        self.authenticate_as(self.owner)
        Project.objects.create(name="Alpha Rocket", owner=self.owner)
        Project.objects.create(name="Beta Shuttle", owner=self.owner)

        response = self.client.get(PROJECTS_URL, {"search": "Rocket"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        names = [item["name"] for item in response.data["results"]]
        self.assertIn("Alpha Rocket", names)
        self.assertNotIn("Beta Shuttle", names)

    def test_filter_by_visibility(self) -> None:
        self.authenticate_as(self.owner)
        Project.objects.create(name="Public One", owner=self.owner, visibility=Project.Visibility.PUBLIC)

        response = self.client.get(PROJECTS_URL, {"visibility": "PUBLIC"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for item in response.data["results"]:
            self.assertEqual(item["visibility"], "PUBLIC")

    def test_list_only_returns_own_projects(self) -> None:
        Project.objects.create(name="Someone Else's", owner=self.other_user)
        self.authenticate_as(self.owner)

        response = self.client.get(PROJECTS_URL)

        names = [item["name"] for item in response.data["results"]]
        self.assertIn("Owner Project", names)
        self.assertNotIn("Someone Else's", names)
