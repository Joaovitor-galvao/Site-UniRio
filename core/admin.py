from django.contrib import admin
from .models import Event, News, TeamSlide


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "date", "location", "show_on_home", "is_active", "updated_at")
    list_filter = ("is_active", "show_on_home", "date")
    search_fields = ("title", "location", "description")
    ordering = ("date", "title")
    date_hierarchy = "date"
    readonly_fields = ("created_at", "updated_at")


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ("title", "published_at", "show_on_home", "is_active", "updated_at")
    list_filter = ("is_active", "show_on_home", "published_at")
    search_fields = ("title", "summary")
    ordering = ("-published_at", "-id")
    date_hierarchy = "published_at"
    readonly_fields = ("created_at", "updated_at")


@admin.register(TeamSlide)
class TeamSlideAdmin(admin.ModelAdmin):
    list_display = ("title", "order", "is_active", "updated_at")
    list_editable = ("order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("title", "text")
    ordering = ("order", "id")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Conteúdo", {"fields": ("title", "text", "alt_text")}),
        ("Imagem", {"fields": ("image", "static_image")}),
        ("Exibição", {"fields": ("order", "is_active")}),
        ("Controle", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )




admin.site.site_header = "CON(S)CIÊNCIA POLÍTICA — Administração"
admin.site.site_title = "Admin CON(S)CIÊNCIA POLÍTICA"
admin.site.index_title = "Conteúdo do site"
