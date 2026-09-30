from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path

from candidates import views as candidate_views
from core import views as core_views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/editable-content/", core_views.editable_content_api, name="editable_content_api"),
    path("api/editable-content/save/", core_views.editable_content_save, name="editable_content_save"),
    path("api/editable-content/reset/", core_views.editable_content_reset, name="editable_content_reset"),
    path("", core_views.home, name="home"),
    path("index.html", core_views.home),
    path("admin-panel.html", core_views.legacy_page, {"filename": "admin-panel.html"}),
    path("eventos.html", core_views.events, name="events"),
    path("candidatos-presidente.html", candidate_views.candidate_list, {"category": "president"}, name="president_candidates"),
    path("candidatos-governador.html", candidate_views.candidate_list, {"category": "governor"}, name="governor_candidates"),
    path("candidatos/<slug:slug>/", candidate_views.slug_detail, name="candidate_slug"),
    path("candidato-presidente-<int:legacy_id>.html", candidate_views.legacy_detail, {"category": "president"}),
    path("candidato-governador-<int:legacy_id>.html", candidate_views.legacy_detail, {"category": "governor"}),
    path("ana-carla-silva.html", core_views.legacy_page, {"filename": "ana-carla-silva.html"}),
    path("candidatos-deputado-federal.html", core_views.legacy_page, {"filename": "candidatos-deputado-federal.html"}),
    path("candidatos-senador.html", core_views.legacy_page, {"filename": "candidatos-senador.html"}),
    path("carlos-santos.html", core_views.legacy_page, {"filename": "carlos-santos.html"}),
    path("contato.html", core_views.legacy_page, {"filename": "contato.html"}),
    path("conteudo-interativo.html", core_views.legacy_page, {"filename": "conteudo-interativo.html"}),
    path("deputado-federal.html", core_views.legacy_page, {"filename": "deputado-federal.html"}),
    path("eleicoes-2026.html", core_views.legacy_page, {"filename": "eleicoes-2026.html"}),
    path("fernanda-lima.html", core_views.legacy_page, {"filename": "fernanda-lima.html"}),
    path("flashcards.html", core_views.legacy_page, {"filename": "flashcards.html"}),
    path("governador.html", core_views.legacy_page, {"filename": "governador.html"}),
    path("informacoes.html", core_views.legacy_page, {"filename": "informacoes.html"}),
    path("joao-mendes.html", core_views.legacy_page, {"filename": "joao-mendes.html"}),
    path("maria-oliveira.html", core_views.legacy_page, {"filename": "maria-oliveira.html"}),
    path("presidente.html", core_views.legacy_page, {"filename": "presidente.html"}),
    path("quiz.html", core_views.legacy_page, {"filename": "quiz.html"}),
    path("rafael-costa.html", core_views.legacy_page, {"filename": "rafael-costa.html"}),
    path("referencias.html", core_views.legacy_page, {"filename": "referencias.html"}),
    path("senador.html", core_views.legacy_page, {"filename": "senador.html"}),
    path("simulador.html", core_views.legacy_page, {"filename": "simulador.html"}),
    path("sobre.html", core_views.legacy_page, {"filename": "sobre.html"}),
    path("voce-e-o-senador.html", core_views.legacy_page, {"filename": "voce-e-o-senador.html"}),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
