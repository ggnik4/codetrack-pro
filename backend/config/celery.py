import os

from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")

app = Celery("codetrack_pro")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Periodic jobs (wired up as each domain app gets real tasks in later phases)
app.conf.beat_schedule = {
    "sync-active-users-hourly": {
        "task": "apps.accounts.tasks.sync_all_connected_accounts",
        "schedule": crontab(minute=0),  # every hour
    },
    "refresh-contests-daily": {
        "task": "apps.contests.tasks.refresh_contest_calendar",
        "schedule": crontab(hour=3, minute=0),  # 03:00 IST
    },
    "recalculate-analytics-nightly": {
        "task": "apps.core.tasks.recalculate_daily_snapshots",
        "schedule": crontab(hour=0, minute=30),  # 00:30 IST
    },
}


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
