import json
from pathlib import Path

from django.db import migrations
from django.utils.text import slugify


def seed_candidates(apps, schema_editor):
    Candidate = apps.get_model("candidates", "Candidate")
    seed_path = Path(__file__).resolve().parents[1] / "seed_candidates.json"
    data = json.loads(seed_path.read_text(encoding="utf-8"))

    for item in data:
        lookup = {
            "category": item["category"],
            "legacy_id": item["legacy_id"],
        }
        defaults = {key: value for key, value in item.items() if key not in lookup}
        defaults["slug"] = slugify(f"{item['name']}-{item['party']}-{item['number']}")
        Candidate.objects.get_or_create(**lookup, defaults=defaults)


class Migration(migrations.Migration):
    dependencies = [("candidates", "0001_initial")]
    operations = [migrations.RunPython(seed_candidates, migrations.RunPython.noop)]
