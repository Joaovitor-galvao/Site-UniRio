from django.http import JsonResponse
from django.views import View
from django.views.generic import TemplateView
from .models import QuizQuestion, SimulatorScenario, Flashcard, SenatorGameData

# --- APIs JSON para o frontend JS consumir ---

class QuizAPIView(View):
    def get(self, request):
        questions = QuizQuestion.objects.filter(is_active=True).values(
            'id', 'question', 'options', 'explanation', 'category', 'order'
        )
        return JsonResponse({'questions': list(questions)})


class SimulatorAPIView(View):
    def get(self, request):
        scenarios = SimulatorScenario.objects.filter(is_active=True).values(
            'id', 'title', 'description', 'steps'
        )
        return JsonResponse({'scenarios': list(scenarios)})


class FlashcardsAPIView(View):
    def get(self, request):
        category = request.GET.get('category')
        qs = Flashcard.objects.filter(is_active=True)
        if category:
            qs = qs.filter(category=category)
        cards = qs.values('id', 'front', 'back', 'category', 'order')
        return JsonResponse({'cards': list(cards)})


class SenatorGameAPIView(View):
    def get(self, request):
        scenarios = SenatorGameData.objects.filter(is_active=True).values(
            'id', 'title', 'scenario', 'options', 'consequences', 'order'
        )
        return JsonResponse({'scenarios': list(scenarios)})


# --- Páginas HTML (servem templates que usam as APIs acima) ---

class QuizView(TemplateView):
    template_name = 'interactive/quiz.html'

class SimulatorView(TemplateView):
    template_name = 'interactive/simulator.html'

class FlashcardsView(TemplateView):
    template_name = 'interactive/flashcards.html'

class SenatorView(TemplateView):
    template_name = 'interactive/senator.html'