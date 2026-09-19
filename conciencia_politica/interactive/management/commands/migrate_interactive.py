import os
from django.core.management.base import BaseCommand
from interactive.models import QuizQuestion, SimulatorScenario, Flashcard, SenatorGameData

class Command(BaseCommand):
    help = 'Cria dados iniciais para quiz, simulador, flashcards e senador'

    def handle(self, *args, **options):
        # Quiz
        questions = [
            {
                'question': 'Quantos votos temos em uma eleicao geral?',
                'options': [
                    {'text': 'Dois votos', 'correct': False},
                    {'text': 'Tres votos', 'correct': True},
                    {'text': 'Quatro votos', 'correct': False},
                    {'text': 'Um voto', 'correct': False},
                ],
                'explanation': 'Votamos para Presidente, Governador, Senador (2), Deputado Federal e Deputado Estadual/Distrital.',
                'category': 'Processo Eleitoral',
                'order': 1,
            },
            {
                'question': 'Qual a idade minima para votar no Brasil?',
                'options': [
                    {'text': '16 anos', 'correct': True},
                    {'text': '18 anos', 'correct': False},
                    {'text': '21 anos', 'correct': False},
                    {'text': '14 anos', 'correct': False},
                ],
                'explanation': 'A idade minima para votar no Brasil e 16 anos. O voto e obrigatorio entre 18 e 70 anos.',
                'category': 'Direitos Politicos',
                'order': 2,
            },
        ]
        
        for q in questions:
            QuizQuestion.objects.get_or_create(question=q['question'], defaults=q)
        
        self.stdout.write(f"  Quiz: {len(questions)} perguntas criadas")
        
        # Simulador
        scenarios = [
            {
                'title': 'Simulador de Voto',
                'description': 'Entenda como seu voto impacta a composicao politica.',
                'steps': {'step1': 'Escolha o cargo', 'step2': 'Veja os candidatos', 'step3': 'Confirme'},
            },
        ]
        for s in scenarios:
            SimulatorScenario.objects.get_or_create(title=s['title'], defaults=s)
        
        self.stdout.write(f"  Simulador: {len(scenarios)} cenarios criados")
        
        # Flashcards
        cards = [
            {'front': 'O que e voto consciente?', 'back': 'Voto baseado em informacao, nao em impulso.', 'category': 'Conceitos', 'order': 1},
            {'front': 'Quem pode votar?', 'back': 'Brasileiros natos/naturalizados, 16+ anos, alistados.', 'category': 'Conceitos', 'order': 2},
            {'front': 'O que e coligacao?', 'back': 'Uniao de partidos para eleicoes proporcionais.', 'category': 'Processo Eleitoral', 'order': 1},
        ]
        for c in cards:
            Flashcard.objects.get_or_create(front=c['front'], defaults=c)
        
        self.stdout.write(f"  Flashcards: {len(cards)} cards criados")
        
        # Senador
        scenarios = [
            {
                'title': 'Projeto de Lei Ambiental',
                'scenario': 'Chega ao Senado um projeto que flexibiliza licenciamento ambiental...',
                'options': [
                    {'text': 'Votar a favor (desenvolvimento economico)', 'effects': {'economy': 10, 'environment': -20}},
                    {'text': 'Votar contra (protecao ambiental)', 'effects': {'economy': -5, 'environment': 15}},
                ],
            },
        ]
        for s in scenarios:
            SenatorGameData.objects.get_or_create(title=s['title'], defaults=s)
        
        self.stdout.write(f"  Senador: {len(scenarios)} cenarios criados")
        
        self.stdout.write(self.style.SUCCESS("\n[OK] Migracao de interativos concluida."))