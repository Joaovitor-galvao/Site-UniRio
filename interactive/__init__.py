# Proxy module for interactive app
# Uses lazy imports to avoid AppRegistryNotReady errors

def __getattr__(name):
    if name == 'QuizQuestion':
        from conciencia_politica.interactive.models import QuizQuestion
        return QuizQuestion
    if name == 'SimulatorScenario':
        from conciencia_politica.interactive.models import SimulatorScenario
        return SimulatorScenario
    if name == 'Flashcard':
        from conciencia_politica.interactive.models import Flashcard
        return Flashcard
    if name == 'SenatorGameData':
        from conciencia_politica.interactive.models import SenatorGameData
        return SenatorGameData
    if name == 'QuizQuestion':
        from conciencia_politica.interactive.models import QuizQuestion
        return QuizQuestion
    if name == 'SimulatorScenario':
        from conciencia_politica.interactive.models import SimulatorScenario
        return SimulatorScenario
    if name == 'Flashcard':
        from conciencia_politica.interactive.models import Flashcard
        return Flashcard
    if name == 'SenatorGameData':
        from conciencia_politica.interactive.models import SenatorGameData
        return SenatorGameData
    if name == 'QuizQuestion':
        from conciencia_politica.interactive.models import QuizQuestion
        return QuizQuestion
    if name == 'SimulatorScenario':
        from conciencia_politica.interactive.models import SimulatorScenario
        return SimulatorScenario
    if name == 'Flashcard':
        from conciencia_politica.interactive.models import Flashcard
        return Flashcard
    if name == 'SenatorGameData':
        from conciencia_politica.interactive.models import SenatorGameData
        return SenatorGameData
    if name == 'QuizView':
        from conciencia_politica.interactive.views import QuizView
        return QuizView
    if name == 'SimulatorView':
        from conciencia_politica.interactive.views import SimulatorView
        return SimulatorView
    if name == 'FlashcardsView':
        from conciencia_politica.interactive.views import FlashcardsView
        return FlashcardsView
    if name == 'SenatorView':
        from conciencia_politica.interactive.views import SenatorView
        return SenatorView
    if name == 'QuizAPIView':
        from conciencia_politica.interactive.views import QuizAPIView
        return QuizAPIView
    if name == 'SimulatorAPIView':
        from conciencia_politica.interactive.views import SimulatorAPIView
        return SimulatorAPIView
    if name == 'FlashcardsAPIView':
        from conciencia_politica.interactive.views import FlashcardsAPIView
        return FlashcardsAPIView
    if name == 'SenatorGameAPIView':
        from conciencia_politica.interactive.views import SenatorGameAPIView
        return SenatorGameAPIView
    raise AttributeError(f"module 'interactive' has no attribute '{name}'")

def __dir__():
    return [
        'QuizQuestion', 'SimulatorScenario', 'Flashcard', 'SenatorGameData',
        'QuizQuestion', 'SimulatorScenario', 'Flashcard', 'SenatorGameData',
        'QuizView', 'SimulatorView', 'FlashcardsView', 'SenatorView',
        'QuizAPIView', 'SimulatorAPIView', 'FlashcardsAPIView', 'SenatorGameAPIView',
    ]