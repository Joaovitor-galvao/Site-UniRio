import json

from django.http import Http404, JsonResponse
from django.shortcuts import redirect, render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

from .models import Event, News, TeamSlide
from sitepages.models import PageElement, SitePage

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


def _normalize_page_path(raw):
    page = (raw or "/").strip()[:255]
    if page == "/index.html":
        return "/"
    return page


@require_GET
@ensure_csrf_cookie
def editable_content_api(request):
    path = _normalize_page_path(request.GET.get("page"))
    try:
        page = SitePage.objects.get(path=path, is_active=True)
    except SitePage.DoesNotExist:
        return JsonResponse({"page": path, "content": {}, "theme": None, "can_edit": False})

    rows = page.elements.filter(is_active=True).order_by("order", "id")
    content = {
        row.key: {
            "kind": row.kind,
            "value": row.rendered_value,
            "label": row.label,
            "page": page.path,
        }
        for row in rows
    }
    theme = {
        "background": page.background_color,
        "surface": page.surface_color,
        "text": page.text_color,
        "primary": page.primary_color,
        "secondary": page.secondary_color,
        "dark": page.dark_color,
        "light": page.light_color,
        "custom_css": page.custom_css,
    }
    return JsonResponse({
        "page": path,
        "content": content,
        "theme": theme,
        # A edição agora é feita exclusivamente pelo /admin/.
        "can_edit": False,
    })


def _staff_json_guard(request):
    if not request.user.is_authenticated:
        return JsonResponse({"ok": False, "error": "Faça login no Admin."}, status=401)
    if not request.user.is_staff:
        return JsonResponse({"ok": False, "error": "Usuário sem permissão de edição."}, status=403)
    return None


@require_POST
def editable_content_save(request):
    """Compatibilidade com clientes antigos. O novo fluxo recomendado é o Django Admin."""
    denied = _staff_json_guard(request)
    if denied:
        return denied
    try:
        payload = json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"ok": False, "error": "JSON inválido."}, status=400)

    path = _normalize_page_path(payload.get("page"))
    key = str(payload.get("key") or "").strip()[:500]
    label = str(payload.get("label") or "").strip()[:255]
    kind = str(payload.get("kind") or "html").strip()
    value = payload.get("value")
    if not key or kind not in {"html", "image"} or not isinstance(value, str):
        return JsonResponse({"ok": False, "error": "Dados de edição inválidos."}, status=400)

    try:
        page = SitePage.objects.get(path=path)
    except SitePage.DoesNotExist:
        return JsonResponse({"ok": False, "error": "Página não cadastrada. Rode seed_pages."}, status=404)

    item, _ = PageElement.objects.update_or_create(
        page=page,
        key=key,
        defaults={"label": label or key, "kind": kind, "value": value, "is_active": True},
    )
    return JsonResponse({"ok": True, "updated_at": item.updated_at.isoformat()})


@require_POST
def editable_content_reset(request):
    denied = _staff_json_guard(request)
    if denied:
        return denied
    return JsonResponse({
        "ok": False,
        "error": "A restauração visual foi desativada. Edite o conteúdo diretamente em Páginas do site no Admin.",
    }, status=409)
