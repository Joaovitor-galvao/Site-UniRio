from django.db import models
from django.utils.text import slugify


class Candidate(models.Model):
    CATEGORY_CHOICES = [
        ('president', 'Presidente'),
        ('governor', 'Governador'),
        ('deputy_federal', 'Deputado Federal'),
        ('deputy_state', 'Deputado Estadual'),
        ('senator', 'Senador'),
    ]

    STATE_CHOICES = [
        ('AC', 'Acre'), ('AL', 'Alagoas'), ('AP', 'Amapá'), ('AM', 'Amazonas'),
        ('BA', 'Bahia'), ('CE', 'Ceará'), ('DF', 'Distrito Federal'), ('ES', 'Espírito Santo'),
        ('GO', 'Goiás'), ('MA', 'Maranhão'), ('MT', 'Mato Grosso'), ('MS', 'Mato Grosso do Sul'),
        ('MG', 'Minas Gerais'), ('PA', 'Pará'), ('PB', 'Paraíba'), ('PR', 'Paraná'),
        ('PE', 'Pernambuco'), ('PI', 'Piauí'), ('RJ', 'Rio de Janeiro'), ('RN', 'Rio Grande do Norte'),
        ('RS', 'Rio Grande do Sul'), ('RO', 'Rondônia'), ('RR', 'Roraima'), ('SC', 'Santa Catarina'),
        ('SP', 'São Paulo'), ('SE', 'Sergipe'), ('TO', 'Tocantins'),
    ]

    name = models.CharField("Nome de urna", max_length=200)
    slug = models.SlugField("Slug", max_length=220, unique=True, blank=True)
    full_name = models.CharField("Nome completo", max_length=200, blank=True)
    category = models.CharField("Cargo", max_length=20, choices=CATEGORY_CHOICES)
    state = models.CharField("Estado", max_length=2, choices=STATE_CHOICES, blank=True)
    party = models.CharField("Partido (sigla)", max_length=10)
    party_name = models.CharField("Partido (nome)", max_length=100, blank=True)
    number = models.IntegerField("Número", unique=True)
    vice = models.CharField("Vice", max_length=200, blank=True)
    vice_party = models.CharField("Partido do vice", max_length=10, blank=True)
    coalition = models.CharField("Coligação", max_length=200, blank=True)
    birth_date = models.CharField("Nascimento", max_length=50, blank=True)
    birthplace = models.CharField("Naturalidade", max_length=200, blank=True)
    profession = models.CharField("Profissão", max_length=100, blank=True)
    education = models.CharField("Formação", max_length=200, blank=True)
    trajectory = models.TextField("Trajetória", blank=True)
    status_tse = models.CharField("Status TSE", max_length=50, default="Validado")
    photo = models.ImageField("Foto", upload_to="candidates/", blank=True)
    proposals = models.JSONField("Propostas", default=dict, blank=True)
    order = models.IntegerField("Ordem de exibição", default=0)
    is_active = models.BooleanField("Ativo", default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'order', 'name']
        verbose_name = "Candidato"
        verbose_name_plural = "Candidatos"
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['slug']),
        ]

    def __str__(self):
        return f"{self.name} ({self.party}) - {self.get_category_display()}"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.name}-{self.party}-{self.number}")
            self.slug = base_slug
            counter = 1
            while Candidate.objects.filter(slug=self.slug).exclude(pk=self.pk).exists():
                self.slug = f"{base_slug}-{counter}"
                counter += 1
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        from django.urls import reverse
        return reverse('candidate_detail', kwargs={'slug': self.slug})