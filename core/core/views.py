from django.http import Http404
from django.shortcuts import redirect, render

from .models import Event, News, TeamSlide

LEGACY_PAGES = {
    "ana-carla-silva.html": "legacy/ana-carla-silva.html",
    "candidatos-deputado-federal.html": "legacy/candidatos-deputado-federal.html",
    "candidatos-senador.html": "legacy/candidatos-senador.html",
    "carlos-santos.html": "legacy/carlos-santos.html",
    "contato.html": "legacy/contato.html",
    "conteudo-interativo.html": "legacy/conteudo-interativo.html",
    "deputado-federal.html": "legacy/deputado-federal.html",
    "eleicoes-2026.html": "legacy/eleicoes-2026.html",
    "fernanda-lima.html": "legacy/fernanda-lima.html",
    "flashcards.html": "legacy/flashcards.html",
    "governador.html": "legacy/governador.html",
    "index.html": "legacy/index.html",
    "informacoes.html": "legacy/informacoes.html",
    "joao-mendes.html": "legacy/joao-mendes.html",
    "maria-oliveira.html": "legacy/maria-oliveira.html",
    "presidente.html": "legacy/presidente.html",
    "quiz.html": "legacy/quiz.html",
    "rafael-costa.html": "legacy/rafael-costa.html",
    "referencias.html": "legacy/referencias.html",
    "senador.html": "legacy/senador.html",
    "simulador.html": "legacy/simulador.html",
    "sobre.html": "legacy/sobre.html",
    "voce-e-o-senador.html": "legacy/voce-e-o-senador.html",
}


def home(request):
    context = {
        "team_slides": TeamSlide.objects.filter(is_active=True),
        "home_news": News.objects.filter(is_active=True, show_on_home=True)[:2],
        "home_events": Event.objects.filter(is_active=True, show_on_home=True)[:2],
    }
    return render(request, "legacy/index.html", context)


def events(request):
    return render(
        request,
        "legacy/eventos.html",
        {"events": Event.objects.filter(is_active=True)},
    )


def legacy_page(request, filename):
    if filename == "admin-panel.html":
        return redirect("/admin/")
    template = LEGACY_PAGES.get(filename)
    if not template:
        raise Http404
    return render(request, template)
