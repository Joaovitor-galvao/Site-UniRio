from django.db import models
from django.conf import settings


class ContentBlock(models.Model):
    TYPE_CHOICES = [
        ('text', 'Texto simples'),
        ('html', 'HTML rico'),
        ('list', 'Lista (uma linha por item)'),
        ('json', 'JSON estruturado'),
    ]

    key = models.SlugField("Chave única", max_length=100, unique=True)
    label = models.CharField("Rótulo amigável", max_length=200)
    content = models.TextField("Conteúdo", blank=True)
    content_type = models.CharField("Tipo", max_length=10, choices=TYPE_CHOICES, default='text')
    help_text = models.TextField("Ajuda para o editor", blank=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Atualizado por"
    )
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['key']
        verbose_name = "Bloco de Conteúdo"
        verbose_name_plural = "Blocos de Conteúdo"

    def __str__(self):
        return f"{self.key} — {self.label}"

    def get_rendered_content(self):
        """Retorna conteúdo processado conforme tipo."""
        if self.content_type == 'list':
            items = [line.strip() for line in self.content.split('\n') if line.strip()]
            return '<ul>' + ''.join(f'<li>{item}</li>' for item in items) + '</ul>'
        return self.content