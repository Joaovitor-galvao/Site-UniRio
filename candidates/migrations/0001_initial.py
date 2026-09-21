from django.db import migrations, models
class Migration(migrations.Migration):
    initial=True
    dependencies=[]
    operations=[migrations.CreateModel(name="Candidate",fields=[
        ("id",models.BigAutoField(auto_created=True,primary_key=True,serialize=False,verbose_name="ID")),
        ("legacy_id",models.PositiveIntegerField(verbose_name="ID legado")),
        ("name",models.CharField(max_length=200,verbose_name="Nome de urna")),
        ("slug",models.SlugField(blank=True,max_length=240,unique=True)),
        ("full_name",models.CharField(blank=True,max_length=240,verbose_name="Nome completo")),
        ("category",models.CharField(choices=[("president","Presidente"),("governor","Governador")],max_length=20,verbose_name="Cargo")),
        ("state",models.CharField(blank=True,max_length=2,verbose_name="Estado")),
        ("party",models.CharField(max_length=20,verbose_name="Partido")),
        ("party_name",models.CharField(blank=True,max_length=160,verbose_name="Nome do partido")),
        ("number",models.PositiveIntegerField(verbose_name="Número")),
        ("vice",models.CharField(blank=True,max_length=240,verbose_name="Vice")),
        ("vice_party",models.CharField(blank=True,max_length=40,verbose_name="Partido do vice")),
        ("coalition",models.CharField(blank=True,max_length=240,verbose_name="Coligação")),
        ("birth_date",models.CharField(blank=True,max_length=80,verbose_name="Nascimento")),
        ("birthplace",models.CharField(blank=True,max_length=240,verbose_name="Naturalidade")),
        ("profession",models.CharField(blank=True,max_length=240,verbose_name="Profissão/Ocupação")),
        ("education",models.CharField(blank=True,max_length=240,verbose_name="Formação")),
        ("trajectory",models.TextField(blank=True,verbose_name="Trajetória")),
        ("status_tse",models.CharField(blank=True,max_length=300,verbose_name="Situação eleitoral")),
        ("photo",models.ImageField(blank=True,upload_to="candidates/",verbose_name="Nova foto")),
        ("photo_static",models.CharField(blank=True,max_length=300,verbose_name="Foto original")),
        ("proposals",models.JSONField(blank=True,default=dict,verbose_name="Propostas")),
        ("is_active",models.BooleanField(default=True,verbose_name="Ativo")),
        ("updated_at",models.DateTimeField(auto_now=True)),
    ],options={"ordering":["category","legacy_id"]}),
    migrations.AddConstraint(model_name="candidate",constraint=models.UniqueConstraint(fields=("category","legacy_id"),name="candidate_legacy_category_unique")),
    ]
