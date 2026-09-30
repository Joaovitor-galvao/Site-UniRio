from django.db import models


class SitePage(models.Model):
    name = models.CharField("Nome da página", max_length=120)
    path = models.CharField("Endereço da página", max_length=255, unique=True)
    template_name = models.CharField("Arquivo HTML", max_length=255, unique=True)
    order = models.PositiveIntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativa", default=True)

    # Paleta editável por página. Os valores padrão preservam a identidade atual.
    background_color = models.CharField("Fundo geral", max_length=7, default="#faf5e8")
    surface_color = models.CharField("Fundo de cards/seções", max_length=7, default="#ffffff")
    text_color = models.CharField("Texto principal", max_length=7, default="#111111")
    primary_color = models.CharField("Cor principal", max_length=7, default="#b83f68")
    secondary_color = models.CharField("Cor secundária", max_length=7, default="#963353")
    dark_color = models.CharField("Cabeçalho / fundo escuro", max_length=7, default="#000000")
    light_color = models.CharField("Texto sobre fundo escuro", max_length=7, default="#ffffff")
    custom_css = models.TextField(
        "CSS personalizado",
        blank=True,
        help_text="Opcional. Use apenas para ajustes avançados desta página.",
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Página do site"
        verbose_name_plural = "Páginas do site"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class PageElement(models.Model):
    KINDS = [
        ("html", "Texto"),
        ("image", "Imagem"),
    ]

    page = models.ForeignKey(SitePage, on_delete=models.CASCADE, related_name="elements", verbose_name="Página")
    key = models.CharField("Identificador interno", max_length=500)
    label = models.CharField("O que você está editando", max_length=255)
    kind = models.CharField("Tipo", max_length=20, choices=KINDS, default="html")
    value = models.TextField("Conteúdo atual", blank=True)
    uploaded_image = models.ImageField("Nova imagem", upload_to="pages/", blank=True)
    order = models.PositiveIntegerField("Ordem", default=0)
    is_active = models.BooleanField("Aplicar esta alteração", default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Conteúdo da página"
        verbose_name_plural = "Conteúdos da página"
        ordering = ["order", "id"]
        constraints = [
            models.UniqueConstraint(fields=["page", "key"], name="sitepages_page_element_unique")
        ]

    def __str__(self):
        return self.label

    @property
    def rendered_value(self):
        if self.kind == "image" and self.uploaded_image:
            return self.uploaded_image.url
        return self.value
