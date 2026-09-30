from pathlib import Path

from bs4 import BeautifulSoup
from django.conf import settings
from django.contrib import admin, messages
from django.http import HttpResponseRedirect
from django.urls import path, reverse
from django.utils.html import format_html

from .forms import PageElementInlineForm, SitePageAdminForm
from .models import PageElement, SitePage
from .management.commands.seed_pages import EDITABLE_TAGS, is_editable, label_for, stable_key


COLOR_FIELDS = (
    "background_color",
    "surface_color",
    "text_color",
    "primary_color",
    "secondary_color",
    "dark_color",
    "light_color",
)


class PageElementInline(admin.StackedInline):
    model = PageElement
    form = PageElementInlineForm
    extra = 0
    can_delete = False
    show_change_link = False
    fields = ("label", "kind", "value", "uploaded_image", "image_preview", "is_active")
    readonly_fields = ("label", "kind", "image_preview")
    ordering = ("order", "id")

    def image_preview(self, obj):
        if not obj or obj.kind != "image":
            return "—"
        src = obj.rendered_value
        if not src:
            return "Sem imagem"
        return format_html(
            '<img src="{}" style="max-width:260px;max-height:150px;border-radius:8px;border:1px solid #555;padding:4px;background:#fff">',
            src,
        )

    image_preview.short_description = "Prévia"


@admin.register(SitePage)
class SitePageAdmin(admin.ModelAdmin):
    form = SitePageAdminForm
    inlines = [PageElementInline]
    change_form_template = "admin/sitepages/sitepage/change_form.html"
    list_display = ("name", "html_file", "path", "element_count", "color_preview", "updated_at")
    list_display_links = ("name", "html_file")
    ordering = ("order", "name")
    search_fields = ("name", "path", "template_name")
    readonly_fields = ("name", "path", "template_name", "order", "updated_at")
    save_on_top = True
    fieldsets = (
        ("Página", {
            "fields": ("name", "template_name", "path"),
            "description": "Edite abaixo as cores e, mais embaixo, os textos e imagens desta página.",
        }),
        ("Cores desta página", {
            "fields": (
                ("primary_color", "secondary_color"),
                ("background_color", "surface_color"),
                ("text_color", "dark_color", "light_color"),
            ),
            "description": "Clique nos quadrados de cor para escolher a paleta desta página.",
        }),
        ("Avançado", {
            "fields": ("custom_css", "is_active", "order", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def get_urls(self):
        custom_urls = [
            path(
                "<int:object_id>/restore-original/",
                self.admin_site.admin_view(self.restore_original),
                name="sitepages_sitepage_restore",
            ),
        ]
        return custom_urls + super().get_urls()

    def restore_original(self, request, object_id):
        page = self.get_object(request, object_id)
        if page is None:
            self.message_user(request, "Página não encontrada.", level=messages.ERROR)
            return HttpResponseRedirect(reverse("admin:index"))

        if request.method != "POST":
            self.message_user(request, "A restauração precisa ser confirmada pelo botão do Admin.", level=messages.WARNING)
            return HttpResponseRedirect(reverse("admin:sitepages_sitepage_change", args=[page.pk]))

        if not self.has_change_permission(request, page):
            self.message_user(request, "Você não tem permissão para restaurar esta página.", level=messages.ERROR)
            return HttpResponseRedirect(reverse("admin:index"))

        file_path = Path(settings.BASE_DIR) / "templates" / page.template_name
        if not file_path.exists():
            self.message_user(request, f"HTML original não encontrado: {page.template_name}", level=messages.ERROR)
            return HttpResponseRedirect(reverse("admin:sitepages_sitepage_change", args=[page.pk]))

        # Remove os conteúdos editados, inclusive uploads vinculados, e recria tudo
        # diretamente do HTML que acompanha o projeto.
        for element in page.elements.all():
            if element.uploaded_image:
                element.uploaded_image.delete(save=False)
        page.elements.all().delete()

        soup = BeautifulSoup(file_path.read_text(encoding="utf-8"), "html.parser")
        seq = 0
        to_create = []
        for tag in soup.find_all(list(EDITABLE_TAGS)):
            if not is_editable(tag):
                continue
            seq += 1
            kind = "image" if tag.name == "img" else "html"
            value = str(tag.get("src") or "") if kind == "image" else str(tag.decode_contents()).strip()
            to_create.append(PageElement(
                page=page,
                key=stable_key(tag),
                label=label_for(tag),
                kind=kind,
                value=value,
                order=seq,
                is_active=True,
            ))
        PageElement.objects.bulk_create(to_create)

        for field_name in COLOR_FIELDS:
            field = SitePage._meta.get_field(field_name)
            setattr(page, field_name, field.get_default())
        page.custom_css = ""
        page.is_active = True
        page.save()

        self.message_user(
            request,
            f'“{page.name}” foi restaurada para o conteúdo e as cores originais do projeto.',
            level=messages.SUCCESS,
        )
        return HttpResponseRedirect(reverse("admin:sitepages_sitepage_change", args=[page.pk]))

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def get_model_perms(self, request):
        # Esconde o módulo genérico "Páginas do site". Links individuais para cada
        # HTML são adicionados diretamente ao grupo CORE mais abaixo.
        return {}

    @admin.display(description="HTML")
    def html_file(self, obj):
        return obj.template_name.rsplit("/", 1)[-1]

    @admin.display(description="Campos")
    def element_count(self, obj):
        return obj.elements.count()

    @admin.display(description="Paleta")
    def color_preview(self, obj):
        return format_html(
            '<span style="display:inline-block;width:18px;height:18px;background:{};border:1px solid #777;border-radius:50%;margin-right:4px"></span>'
            '<span style="display:inline-block;width:18px;height:18px;background:{};border:1px solid #777;border-radius:50%;margin-right:4px"></span>'
            '<span style="display:inline-block;width:18px;height:18px;background:{};border:1px solid #777;border-radius:50%"></span>',
            obj.primary_color,
            obj.background_color,
            obj.dark_color,
        )


@admin.register(PageElement)
class PageElementAdmin(admin.ModelAdmin):
    list_display = ("label", "page", "kind", "updated_at")
    list_filter = ("page", "kind", "is_active")
    search_fields = ("label", "value")

    def get_model_perms(self, request):
        return {}


# ---------------------------------------------------------------------------
# Navegação do Admin
# ---------------------------------------------------------------------------
# Em vez de um único item "Páginas do site", cada HTML aparece diretamente em
# CORE. O clique já abre a tela de edição daquela página.
_original_get_app_list = admin.site.get_app_list


def _get_app_list_with_pages(request, app_label=None):
    app_list = _original_get_app_list(request, app_label)

    # Quando o Django pede explicitamente outro app, não alteramos a resposta.
    if app_label and app_label != "core":
        return app_list

    core_app = next((app for app in app_list if app.get("app_label") == "core"), None)
    if core_app is None:
        return app_list

    sitepage_admin = admin.site._registry.get(SitePage)
    if not sitepage_admin or not sitepage_admin.has_view_or_change_permission(request):
        return app_list

    try:
        pages = list(SitePage.objects.filter(is_active=True).order_by("order", "name"))
    except Exception:
        # O Admin também precisa abrir antes da primeira migration/seed.
        pages = []

    page_links = []
    can_change = sitepage_admin.has_change_permission(request)
    for page in pages:
        page_links.append({
            "model": SitePage,
            "name": page.name,
            "object_name": f"SitePage_{page.pk}",
            "perms": {"add": False, "change": can_change, "delete": False, "view": True},
            "admin_url": reverse("admin:sitepages_sitepage_change", args=[page.pk]),
            "add_url": None,
            "view_only": not can_change,
        })

    core_app["models"].extend(page_links)
    return app_list


admin.site.get_app_list = _get_app_list_with_pages
