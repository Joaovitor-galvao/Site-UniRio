import json
from pathlib import Path

from django.core.management.base import BaseCommand

from candidates.models import Candidate


class Command(BaseCommand):
    help = "Cria no banco os candidatos ausentes usando candidates/seed_candidates.json."

    def add_arguments(self, parser):
        parser.add_argument(
            "--update",
            action="store_true",
            help="Também atualiza candidatos que já existem. Sem esta opção, edições do Admin são preservadas.",
        )

    def handle(self, *args, **options):
        seed_path = Path(__file__).resolve().parents[2] / "seed_candidates.json"
        data = json.loads(seed_path.read_text(encoding="utf-8"))
        created = 0
        updated = 0
        skipped = 0

        for item in data:
            lookup = {
                "category": item["category"],
                "legacy_id": item["legacy_id"],
            }
            defaults = {key: value for key, value in item.items() if key not in lookup}

            candidate = Candidate.objects.filter(**lookup).first()
            if candidate is None:
                Candidate.objects.create(**lookup, **defaults)
                created += 1
                continue

            if not options["update"]:
                skipped += 1
                continue

            for key, value in defaults.items():
                setattr(candidate, key, value)
            candidate.save()
            updated += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Concluído: {created} criado(s), {updated} atualizado(s), {skipped} preservado(s)."
            )
        )
