from django.db import models


class QuizQuestion(models.Model):
    question = models.TextField("Pergunta")
    options = models.JSONField("Opções", help_text='[{"text": "Opção A", "correct": true}, {"text": "Opção B", "correct": false}]')
    explanation = models.TextField("Explicação", blank=True)
    category = models.CharField("Categoria", max_length=50, default="Geral")
    order = models.IntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Pergunta do Quiz"
        verbose_name_plural = "Perguntas do Quiz"

    def __str__(self):
        return f"Q{self.order}: {self.question[:50]}..."


class SimulatorScenario(models.Model):
    title = models.CharField("Título", max_length=200)
    description = models.TextField("Descrição")
    steps = models.JSONField("Passos/Etapas", help_text='Estrutura JSON do simulador')
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Cenário do Simulador"
        verbose_name_plural = "Cenários do Simulador"

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

    def __str__(self):
        return f"{self.category}: {self.front[:40]}..."


class SenatorGameData(models.Model):
    """Dados para 'Você é o Senador'"""
    title = models.CharField("Título do Cenário", max_length=200)
    scenario = models.TextField("Cenário/Contexto")
    options = models.JSONField("Opções", help_text='[{"text": "Opção", "effects": {...}}]')
    consequences = models.JSONField("Consequências", blank=True, default=dict)
    order = models.IntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativo", default=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Cenário - Você é o Senador"
        verbose_name_plural = "Cenários - Você é o Senador"

    def __str__(self):
        return self.title