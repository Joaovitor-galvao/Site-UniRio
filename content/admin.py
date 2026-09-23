from django.contrib import admin
from .models import ContentBlock


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    site_header = "CON(S)CIENCIA POLITICA - Admin"
    site_title = "CON(S)CIENCIA POLITICA"
    index_title = "Painel de Controle"

    list_display = ['label', 'content_type', 'is_editable', 'updated_at']
    list_filter = ['content_type']
    search_fields = ['key', 'label', 'content']
    readonly_fields = ['created_at', 'updated_at', 'updated_by']
    list_per_page = 30

    fieldsets = (
        ('Identificacao', {
            'fields': ('key', 'label'),
            'description': 'Campo "key" eh o identificador usado no site. Nao altere sem orientacao.'
        }),
        ('Conteudo', {
            'fields': ('content', 'content_type', 'help_text'),
            'description': 'HTML: use tags normalmente. Lista: um item por linha.'
        }),
        ('Auditoria', {
            'fields': ('updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',),
        }),
    )

    def is_editable(self, obj):
        return "Tem conteudo" if obj.content else "Sem conteudo"

    is_editable.short_description = "Status"

    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
