from django.db import models


class Event(models.Model):
    title = models.CharField("Título", max_length=200)
    date = models.DateField("Data")
    location = models.CharField("Local", max_length=240)
    description = models.TextField("Descrição")
    link = models.URLField("Link", blank=True)
    is_active = models.BooleanField("Ativo", default=True)
    show_on_home = models.BooleanField("Mostrar na página inicial", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ["date", "title"]

    def __str__(self):
        return f"{self.title} — {self.date:%d/%m/%Y}"


class News(models.Model):
    title = models.CharField("Título", max_length=220)
    summary = models.TextField("Resumo")
    published_at = models.DateField("Data de publicação")
    link = models.URLField("Link", blank=True)
    is_active = models.BooleanField("Ativa", default=True)
    show_on_home = models.BooleanField("Mostrar na página inicial", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Notícia"
        verbose_name_plural = "Notícias"
        ordering = ["-published_at", "-id"]

    def __str__(self):
        return self.title


class TeamSlide(models.Model):
    title = models.CharField("Título do slide", max_length=180)
    text = models.TextField(
        "Texto",
        help_text="Use uma linha para cada nome ou informação que deve aparecer no slide.",
    )
    image = models.ImageField("Imagem enviada", upload_to="team/", blank=True)
    static_image = models.CharField(
        "Imagem estática",
        max_length=300,
        blank=True,
        help_text="Caminho dentro de /static/, por exemplo: imagens/equipe/coordenacao.jpg",
    )
    alt_text = models.CharField("Texto alternativo", max_length=220, blank=True)
    order = models.PositiveIntegerField("Ordem", default=0)
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Slide da equipe"
        verbose_name_plural = "Slides da equipe"
        ordering = ["order", "id"]

    def __str__(self):
        return self.title

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        if self.static_image:
            path = self.static_image.lstrip("/")
            if path.startswith("static/"):
                return "/" + path
            return "/static/" + path
        return "/static/imagens/logo.png"

    @property
    def lines(self):
        return [line.strip() for line in self.text.splitlines() if line.strip()]


class EditableContent(models.Model):
    KINDS = [("html", "Texto/HTML"), ("image", "Imagem")]

    page = models.CharField("Página", max_length=255, db_index=True)
    key = models.CharField("Chave do elemento", max_length=500)
    label = models.CharField("Descrição", max_length=255, blank=True)
    kind = models.CharField("Tipo", max_length=20, choices=KINDS, default="html")
    value = models.TextField("Conteúdo")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Conteúdo editável"
        verbose_name_plural = "Conteúdos editáveis"
        ordering = ["page", "key"]
        constraints = [
            models.UniqueConstraint(fields=["page", "key"], name="editable_content_page_key_unique")
        ]

    def __str__(self):
        return self.label or f"{self.page} — {self.key}"
