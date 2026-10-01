from django.contrib import admin
from .models import Candidate
@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display=("name","category","party","number","is_active","updated_at")
    list_filter=("category","party","is_active")
    search_fields=("name","full_name","party","number")
    ordering=("category","legacy_id")
    readonly_fields=("slug","updated_at")
    fieldsets=(
        ("Identificação",{"fields":("legacy_id","name","full_name","category","state","slug")}),
        ("Partido e chapa",{"fields":("party","party_name","number","vice","vice_party","coalition")}),
        ("Biografia",{"fields":("birth_date","birthplace","profession","education","trajectory","status_tse")}),
        ("Propostas",{"fields":("proposals",)}),
        ("Foto",{"fields":("photo","photo_static")}),
        ("Controle",{"fields":("is_active","updated_at")}),
    )
