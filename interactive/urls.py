from django.urls import path
from .views import (
    QuizView, SimulatorView, FlashcardsView, SenatorView,
    QuizAPIView, SimulatorAPIView, FlashcardsAPIView, SenatorGameAPIView
)

urlpatterns = [
    # Páginas
    path('quiz/', QuizView.as_view(), name='quiz'),
    path('simulador/', SimulatorView.as_view(), name='simulator'),
    path('flashcards/', FlashcardsView.as_view(), name='flashcards'),
    path('senador/', SenatorView.as_view(), name='senator'),
    # APIs
    path('api/quiz/', QuizAPIView.as_view(), name='quiz_api'),
    path('api/simulador/', SimulatorAPIView.as_view(), name='simulator_api'),
    path('api/flashcards/', FlashcardsAPIView.as_view(), name='flashcards_api'),
    path('api/senador/', SenatorGameAPIView.as_view(), name='senator_api'),
]