from django.contrib import admin
from .models import ContentBlock


@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ['key', 'label', 'content_type', 'updated_at', 'updated_by']
    list_filter = ['content_type']
    search_fields = ['key', 'label', 'content']
    readonly_fields = ['created_at', 'updated_at', 'updated_by']
    list_per_page = 30

    fieldsets = (
        ('Identificação', {
            'fields': ('key', 'label', 'content_type', 'help_text')
        }),
        ('Conteúdo', {
            'fields': ('content',),
            'description': 'HTML: use tags normalmente. Lista: um item por linha.'
        }),
        ('Auditoria', {
            'fields': ('updated_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)