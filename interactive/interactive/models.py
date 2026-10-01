from django.db import models


class QuizQuestion(models.Model):
    question = models.TextField("Pergunta")
    options = models.JSONField("Opcoes", help_text='[{"text": "Opcao A", "correct": true}, {"text": "Opcao B", "correct": false}]')
    explanation = models.TextField("Explicacao", blank=True)
    category = models.CharField("Categoria", max_length=50, default="Geral")
    order = models.IntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Pergunta do Quiz"
        verbose_name_plural = "Perguntas do Quiz"
        app_label = 'interactive'

    def __str__(self):
        return f"Q{self.order}: {self.question[:50]}..."


class SimulatorScenario(models.Model):
    title = models.CharField("Titulo", max_length=200)
    description = models.TextField("Descricao")
    steps = models.JSONField("Passos/Etapas", help_text='Estrutura JSON do simulador')
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Cenario do Simulador"
        verbose_name_plural = "Cenarios do Simulador"
        app_label = 'interactive'

    def __str__(self):
        return self.title


class Flashcard(models.Model):
    front = models.TextField("Frente")
    back = models.TextField("Verso")
    category = models.CharField("Categoria", max_length=50)
    order = models.IntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['category', 'order']
        verbose_name = "Flashcard"
        verbose_name_plural = "Flashcards"
        app_label = 'interactive'

    def __str__(self):
        return f"{self.category}: {self.front[:40]}..."


class SenatorGameData(models.Model):
    """Dados para 'Voce e o Senador'"""
    title = models.CharField("Titulo do Cenario", max_length=200)
    scenario = models.TextField("Cenario/Contexto")
    options = models.JSONField("Opcoes", help_text='[{"text": "Opcao", "effects": {...}}]')
    consequences = models.JSONField("Consequencias", blank=True, default=dict)
    order = models.IntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativo", default=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Cenario - Voce e o Senador"
        verbose_name_plural = "Cenarios - Voce e o Senador"
        app_label = 'interactive'

    def __str__(self):
        return self.title