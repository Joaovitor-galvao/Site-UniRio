from django.contrib import admin
from .models import QuizQuestion, SimulatorScenario, Flashcard, SenatorGameData


@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ['order', 'question_short', 'category', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['question', 'explanation']
    list_editable = ['is_active', 'order']
    ordering = ['order']

    def question_short(self, obj):
        return obj.question[:80] + '...' if len(obj.question) > 80 else obj.question
    question_short.short_description = 'Pergunta'


@admin.register(SimulatorScenario)
class SimulatorScenarioAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['title', 'description']


@admin.register(Flashcard)
class FlashcardAdmin(admin.ModelAdmin):
    list_display = ['order', 'category', 'front_short', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['front', 'back']
    list_editable = ['is_active', 'order', 'category']
    ordering = ['category', 'order']

    def front_short(self, obj):
        return obj.front[:60] + '...' if len(obj.front) > 60 else obj.front
    front_short.short_description = 'Frente'


@admin.register(SenatorGameData)
class SenatorGameDataAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'is_active']
    list_editable = ['is_active', 'order']
    ordering = ['order']