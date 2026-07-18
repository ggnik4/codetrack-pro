# Project Management Module

Self-contained Django app implementing CRUD for the `Project` resource.
No existing app or auth config was modified — wire it in as follows.

## 1. Dependency

Add to `requirements.txt` if not already present:

```
django-filter>=24.0
```

## 2. Settings (`settings.py`)

Add to `INSTALLED_APPS`:

```python
INSTALLED_APPS = [
    ...
    "django_filters",
    "projects",
]
```

## 3. Root URLs (`urls.py`)

```python
from django.urls import include, path

urlpatterns = [
    ...
    path("api/v1/", include("projects.urls")),
]
```

## 4. Migrate

```bash
python manage.py migrate projects
```

(A hand-written `0001_initial.py` is included. If your `AUTH_USER_MODEL`
differs from Django's default, the migration already targets it dynamically
via `settings.AUTH_USER_MODEL` — no change needed.)

## 5. Endpoints

| Method | URL                          | Action          | Auth requirement       |
|--------|-------------------------------|-----------------|-------------------------|
| GET    | `/api/v1/projects/`           | list            | authenticated           |
| POST   | `/api/v1/projects/`           | create          | authenticated           |
| GET    | `/api/v1/projects/{id}/`      | retrieve        | authenticated + owner   |
| PATCH  | `/api/v1/projects/{id}/`      | partial_update  | authenticated + owner   |
| DELETE | `/api/v1/projects/{id}/`      | destroy         | authenticated + owner   |

Query params on list: `?search=`, `?ordering=created_at|-created_at|name|-name`,
`?visibility=PRIVATE|PUBLIC`, `?page=`, `?page_size=` (default 20, max 100).

## 6. Swagger

Because the viewset uses `drf-spectacular`'s `@extend_schema_view` decorators,
it will be picked up automatically by your existing `SpectacularAPIView` /
`SpectacularSwaggerView` routes — no extra config needed.

## 7. Tests

```bash
python manage.py test projects
```
