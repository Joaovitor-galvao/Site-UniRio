from django.contrib import admin
from .models import Candidate


@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ['name', 'party', 'number', 'category', 'state', 'is_active', 'order']
    list_filter = ['category', 'party', 'is_active', 'state']
    search_fields = ['name', 'full_name', 'party', 'number']
    list_editable = ['is_active', 'order', 'number']
    ordering = ['category', 'order', 'name']
    readonly_fields = ['created_at', 'updated_at', 'slug']
    list_per_page = 25

    fieldsets = (
        ('Identificação', {
            'fields': ('name', 'full_name', 'category', 'state', 'slug')
        }),
        ('Partido & Número', {
            'fields': ('party', 'party_name', 'number', 'vice', 'vice_party', 'coalition')
        }),
        ('Biografia', {
            'fields': ('birth_date', 'birthplace', 'profession', 'education', 'trajectory', 'status_tse')
        }),
        ('Propostas (JSON)', {
            'fields': ('proposals',),
            'classes': ('collapse',),
            'description': 'Formato: {"Categoria": ["Proposta 1", "Proposta 2"]}'
        }),
        ('Mídia', {
            'fields': ('photo',)
        }),
        ('Controle', {
            'fields': ('is_active', 'order', 'created_at', 'updated_at')
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related()