from django.shortcuts import get_object_or_404, render
from .models import Candidate


def legacy_detail(request, category, legacy_id):
    candidate = get_object_or_404(
        Candidate,
        category=category,
        legacy_id=legacy_id,
        is_active=True,
    )
    return render(request, "candidates/detail.html", {"candidate": candidate})


def slug_detail(request, slug):
    candidate = get_object_or_404(Candidate, slug=slug, is_active=True)
    return render(request, "candidates/detail.html", {"candidate": candidate})


def candidate_list(request, category):
    template_by_category = {
        "president": "legacy/candidatos-presidente.html",
        "governor": "legacy/candidatos-governador.html",
    }
    template = template_by_category.get(category)
    if template is None:
        raise ValueError("Categoria de candidatos inválida")
    candidates = Candidate.objects.filter(category=category, is_active=True).order_by("legacy_id")
    return render(request, template, {"candidates": candidates})
