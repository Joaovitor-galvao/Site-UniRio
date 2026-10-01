import os
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Cria dados iniciais para quiz, simulador, flashcards e senador'

    def handle(self, *args, **options):
        # Import models here to avoid AppRegistryNotReady
        from interactive.models import QuizQuestion, SimulatorScenario, Flashcard, SenatorGameData
        
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
            from interactive.models import QuizQuestion
            QuizQuestion.objects.get_or_create(question=q['question'], defaults=q)
        
        self.stdout.write(f"Quiz: {len(questions)} perguntas criadas")
        
        # Simulador
        scenarios = [
            {
                'title': 'Simulador de Voto',
                'description': 'Entenda como seu voto impacta a composicao politica.',
                'steps': {'step1': 'Escolha o cargo', 'step2': 'Veja os candidatos', 'step3': 'Confirme'},
            },
        ]
        for s in scenarios:
            from interactive.models import SimulatorScenario
            SimulatorScenario.objects.get_or_create(title=s['title'], defaults=s)
        
        self.stdout.write(f"  Simulador: {len(scenarios)} cenarios criados")
        
        # Flashcards
        cards = [
            {'front': 'O que e voto consciente?', 'back': 'Voto baseado em informacao, pesquisa e reflexao, nao em impulso.', 'category': 'Conceitos', 'order': 1},
            {'front': 'Quem pode votar?', 'back': 'Brasileiros natos/naturalizados, 16+ anos, alistados.', 'category': 'Conceitos', 'order': 2},
            {'front': 'O que e coligacao?', 'back': 'Uniao de partidos para eleicoes proporcionais (vereador, deputado), somando votos.', 'category': 'Processo Eleitoral', 'order': 1},
            {'front': 'O que e voto em transito?', 'back': 'Permite votar em outra cidade se estiver fora do domicilio eleitoral, apenas para Presidente.', 'category': 'Processo Eleitoral', 'order': 2},
            {'front': 'O que e voto em branco?', 'back': 'Quando o eleitor nao escolhe nenhum candidato. Nao e contabilizado para nenhum candidato.', 'category': 'Conceitos', 'order': 1},
            {'front': 'O que e voto nulo?', 'back': 'Quando o eleitor digita numero inexistente. Tambem nao e contabilizado para candidatos.', 'category': 'Conceitos', 'order': 2},
            {'front': 'O que e clausula de barreira?', 'back': 'Regra que exige desempenho minimo nas eleicoes para partidos terem direito a tempo de TV e fundo partidario.', 'category': 'Legislacao', 'order': 1},
            {'front': 'Quem pode ser candidato?', 'back': 'Brasileiro nato, alfabetizado, filiado a partido, idade minima (21 para deputado, 30 para senador/governador, 35 para presidente).', 'category': 'Legislacao', 'order': 2},
        ]
        from interactive.models import Flashcard
        for c in cards:
            from interactive.models import Flashcard
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
        from interactive.models import SenatorGameData
        for s in scenarios:
            from interactive.models import SenatorGameData
            SenatorGameData.objects.get_or_create(title=s['title'], defaults=s)
        
        self.stdout.write(self.style.SUCCESS("\n[OK] Migracao de interativos concluida."))