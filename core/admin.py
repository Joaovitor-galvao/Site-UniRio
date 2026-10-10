
from django.contrib import admin, messages
from django.contrib.admin.models import (
    LogEntry,
    ADDITION,
    CHANGE,
    DELETION,
)
from django.db.models import Count
from django.db.utils import OperationalError, ProgrammingError
from django.http import HttpResponseRedirect
from django.urls import path, reverse, NoReverseMatch

from .models import Event, News, TeamSlide

from candidates.models import Candidate
from sitepages.models import SitePage, PageElement
from interactive.models import (
    QuizQuestion,
    SimulatorScenario,
    Flashcard,
    SenatorGameData,
)


# ============================================================
# EVENTOS
# ============================================================

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title", "date", "location",
        "show_on_home", "is_active", "updated_at"
    )
    list_filter = ("is_active", "show_on_home", "date")
    search_fields = ("title", "location", "description")
    ordering = ("date", "title")
    date_hierarchy = "date"
    readonly_fields = ("created_at", "updated_at")


# ============================================================
# NOTÍCIAS
# ============================================================

@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = (
        "title", "published_at", "show_on_home",
        "is_active", "updated_at"
    )
    list_filter = (
        "is_active", "show_on_home", "published_at"
    )
    search_fields = ("title", "summary")
    ordering = ("-published_at", "-id")
    date_hierarchy = "published_at"
    readonly_fields = ("created_at", "updated_at")


# ============================================================
# SLIDES DA EQUIPE
# ============================================================

@admin.register(TeamSlide)
class TeamSlideAdmin(admin.ModelAdmin):
    list_display = (
        "title", "order", "is_active", "updated_at"
    )
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "text")
    ordering = ("order", "id")
    readonly_fields = ("created_at", "updated_at")

    save_on_top = True
    change_form_template = "admin/core/teamslide/change_form.html"

    fieldsets = (
        ("Conteúdo", {
            "fields": ("title", "text", "alt_text")
        }),
        ("Imagem", {
            "fields": ("image", "static_image")
        }),
        ("Exibição", {
            "fields": ("order", "is_active")
        }),
        ("Controle", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    def get_urls(self):
        custom_urls = [
            path(
                "<int:object_id>/restore-original/",
                self.admin_site.admin_view(self.restore_original),
                name="core_teamslide_restore",
            ),
        ]
        return custom_urls + super().get_urls()

    def restore_original(self, request, object_id):
        slide = self.get_object(request, object_id)

        if slide is None:
            self.message_user(
                request,
                "Slide não encontrado.",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(
                reverse("admin:core_teamslide_changelist")
            )

        if request.method != "POST":
            self.message_user(
                request,
                "Use o botão de restauração do Admin.",
                level=messages.WARNING,
            )
            return HttpResponseRedirect(
                reverse(
                    "admin:core_teamslide_change",
                    args=[slide.pk],
                )
            )

        if not self.has_change_permission(request, slide):
            self.message_user(
                request,
                "Você não tem permissão para restaurar este slide.",
                level=messages.ERROR,
            )
            return HttpResponseRedirect(
                reverse("admin:index")
            )

        # Remove somente a referência ao upload.
        # Não exclui o arquivo físico, evitando perda
        # acidental de imagens compartilhadas.
        if slide.image:
            slide.image = None
            slide.save(update_fields=["image", "updated_at"])

        self.message_user(
            request,
            (
                f'A imagem enviada do slide "{slide.title}" '
                "foi removida. O sistema poderá utilizar "
                "a imagem definida em Imagem estática."
            ),
            level=messages.SUCCESS,
        )

        return HttpResponseRedirect(
            reverse(
                "admin:core_teamslide_change",
                args=[slide.pk],
            )
        )


# ============================================================
# CONFIGURAÇÕES DO ADMIN
# ============================================================

admin.site.site_header = (
    "CON(S)CIÊNCIA POLÍTICA — Administração"
)
admin.site.site_title = (
    "Admin CON(S)CIÊNCIA POLÍTICA"
)
admin.site.index_title = "Conteúdo do site"


# ============================================================
# ATIVIDADE RECENTE
# ============================================================

def get_recent_activity(request, limit=10):
    """
    Consulta o histórico real do Django Admin.
    Mostra apenas registros que o usuário
    possui permissão para consultar.
    """

    queryset = LogEntry.objects.select_related(
        "user", "content_type"
    ).order_by("-action_time", "-id")

    if not request.user.is_superuser:
        queryset = queryset.filter(user=request.user)

    activities = []

    type_names = {
        "Candidate": "Candidato",
        "SitePage": "Página do Site",
        "PageElement": "Elemento da Página",
        "Event": "Evento",
        "News": "Notícia",
        "TeamSlide": "Slide da Equipe",
        "QuizQuestion": "Pergunta do Quiz",
        "Flashcard": "Flashcard",
        "SimulatorScenario": "Cenário do Simulador",
        "SenatorGameData": "Você é o Senador",
    }

    for log in queryset[:100]:
        model = log.content_type.model_class()

        if model is None:
            continue

        model_admin = admin.site._registry.get(model)

        if model_admin is None:
            continue

        if not model_admin.has_view_or_change_permission(request):
            continue

        if log.action_flag == ADDITION:
            status_label = "Adicionado"
            status_class = "success"

        elif log.action_flag == CHANGE:
            status_label = "Editado"
            status_class = "warning"

        elif log.action_flag == DELETION:
            status_label = "Excluído"
            status_class = "danger"

        else:
            status_label = "Atualizado"
            status_class = "primary"

        app_label = model._meta.app_label
        model_name = model._meta.model_name

        try:
            admin_url = reverse(
                f"admin:{app_label}_{model_name}_changelist"
            )
        except NoReverseMatch:
            continue

        if log.action_flag != DELETION and log.object_id:
            try:
                obj = model_admin.get_object(
                    request, log.object_id
                )

                if obj is not None and (
                    model_admin.has_view_or_change_permission(
                        request, obj
                    )
                ):
                    admin_url = reverse(
                        f"admin:{app_label}_{model_name}_change",
                        args=[obj.pk],
                    )
            except (ValueError, NoReverseMatch):
                pass

        activities.append({
            "type_label": type_names.get(
                model.__name__,
                str(model._meta.verbose_name).title()
            ),
            "type_class": "primary",
            "title": log.object_repr,
            "status_label": status_label,
            "status_class": status_class,
            "updated_at": log.action_time,
            "admin_url": admin_url,
            "user_name": (
                log.user.get_full_name()
                or log.user.get_username()
            ),
        })

        if len(activities) >= limit:
            break

    return activities


# ============================================================
# DASHBOARD
# ============================================================

_original_admin_index = admin.site.index


def custom_admin_index(request, extra_context=None):

    context = {
        "total_candidates": 0,
        "total_content_blocks": 0,
        "total_quiz_questions": 0,
        "total_flashcards": 0,
        "total_simulator_scenarios": 0,
        "total_senator_scenarios": 0,
        "candidates_by_category": [],
        "content_by_type": [],
        "recent_activity": [],
    }

    try:
        if request.user.has_perm(
            "candidates.view_candidate"
        ):
            context["total_candidates"] = (
                Candidate.objects.count()
            )

            category_names = dict(
                Candidate._meta.get_field("category").choices
            )

            category_totals = (
                Candidate.objects
                .values("category")
                .annotate(total=Count("id"))
                .order_by("category")
            )

            context["candidates_by_category"] = [
                (
                    str(category_names.get(
                        item["category"],
                        item["category"]
                    )),
                    item["total"]
                )
                for item in category_totals
            ]

        if request.user.has_perm(
            "sitepages.view_sitepage"
        ):
            context["total_content_blocks"] = (
                SitePage.objects.count()
            )

            type_names = {
                "html": "Textos e conteúdos",
                "image": "Imagens",
            }

            type_totals = (
                PageElement.objects
                .values("kind")
                .annotate(total=Count("id"))
                .order_by("kind")
            )

            context["content_by_type"] = [
                (
                    type_names.get(
                        item["kind"], item["kind"]
                    ),
                    item["total"]
                )
                for item in type_totals
            ]

        if request.user.has_perm(
            "interactive.view_quizquestion"
        ):
            context["total_quiz_questions"] = (
                QuizQuestion.objects.count()
            )

        if request.user.has_perm(
            "interactive.view_flashcard"
        ):
            context["total_flashcards"] = (
                Flashcard.objects.count()
            )

        if request.user.has_perm(
            "interactive.view_simulatorscenario"
        ):
            context["total_simulator_scenarios"] = (
                SimulatorScenario.objects.count()
            )

        if request.user.has_perm(
            "interactive.view_senatorgamedata"
        ):
            context["total_senator_scenarios"] = (
                SenatorGameData.objects.count()
            )

        context["recent_activity"] = (
            get_recent_activity(request)
        )

    except (OperationalError, ProgrammingError):
        pass

    if extra_context:
        context.update(extra_context)

    return _original_admin_index(
        request,
        extra_context=context,
    )


admin.site.index = custom_admin_index
