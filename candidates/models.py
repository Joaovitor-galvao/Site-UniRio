from django.db import models
from django.utils.text import slugify

class Candidate(models.Model):
    CATEGORIES = [("president","Presidente"),("governor","Governador")]
    legacy_id = models.PositiveIntegerField("ID legado")
    name = models.CharField("Nome de urna", max_length=200)
    slug = models.SlugField(max_length=240, unique=True, blank=True)
    full_name = models.CharField("Nome completo", max_length=240, blank=True)
    category = models.CharField("Cargo", max_length=20, choices=CATEGORIES)
    state = models.CharField("Estado", max_length=2, blank=True)
    party = models.CharField("Partido", max_length=20)
    party_name = models.CharField("Nome do partido", max_length=160, blank=True)
    number = models.PositiveIntegerField("Número")
    vice = models.CharField("Vice", max_length=240, blank=True)
    vice_party = models.CharField("Partido do vice", max_length=40, blank=True)
    coalition = models.CharField("Coligação", max_length=240, blank=True)
    birth_date = models.CharField("Nascimento", max_length=80, blank=True)
    birthplace = models.CharField("Naturalidade", max_length=240, blank=True)
    profession = models.CharField("Profissão/Ocupação", max_length=240, blank=True)
    education = models.CharField("Formação", max_length=240, blank=True)
    trajectory = models.TextField("Trajetória", blank=True)
    status_tse = models.CharField("Situação eleitoral", max_length=300, blank=True)
    photo = models.ImageField("Nova foto", upload_to="candidates/", blank=True)
    photo_static = models.CharField("Foto original", max_length=300, blank=True)
    proposals = models.JSONField("Propostas", default=dict, blank=True)
    is_active = models.BooleanField("Ativo", default=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering=["category","legacy_id"]
        constraints=[models.UniqueConstraint(fields=["category","legacy_id"],name="candidate_legacy_category_unique")]
    def __str__(self): return f"{self.name} ({self.party})"
    def save(self,*args,**kwargs):
        if not self.slug:
            self.slug=slugify(f"{self.name}-{self.party}-{self.number}")
        super().save(*args,**kwargs)
    @property
    def photo_url(self):
        if self.photo: return self.photo.url
        if self.photo_static:
            p=self.photo_static.lstrip("/")
            if p.startswith("static/"): return "/"+p
            return "/static/"+p
        return "/static/imagens/logo.png"
