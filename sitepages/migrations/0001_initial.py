from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="SitePage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=120, verbose_name="Nome da página")),
                ("path", models.CharField(max_length=255, unique=True, verbose_name="Endereço da página")),
                ("template_name", models.CharField(max_length=255, unique=True, verbose_name="Arquivo HTML")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Ordem")),
                ("is_active", models.BooleanField(default=True, verbose_name="Ativa")),
                ("background_color", models.CharField(default="#faf5e8", max_length=7, verbose_name="Fundo geral")),
                ("surface_color", models.CharField(default="#ffffff", max_length=7, verbose_name="Fundo de cards/seções")),
                ("text_color", models.CharField(default="#111111", max_length=7, verbose_name="Texto principal")),
                ("primary_color", models.CharField(default="#b83f68", max_length=7, verbose_name="Cor principal")),
                ("secondary_color", models.CharField(default="#963353", max_length=7, verbose_name="Cor secundária")),
                ("dark_color", models.CharField(default="#000000", max_length=7, verbose_name="Cabeçalho / fundo escuro")),
                ("light_color", models.CharField(default="#ffffff", max_length=7, verbose_name="Texto sobre fundo escuro")),
                ("custom_css", models.TextField(blank=True, help_text="Opcional. Use apenas para ajustes avançados desta página.", verbose_name="CSS personalizado")),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Página do site", "verbose_name_plural": "Páginas do site", "ordering": ["order", "name"]},
        ),
        migrations.CreateModel(
            name="PageElement",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("key", models.CharField(max_length=500, verbose_name="Identificador interno")),
                ("label", models.CharField(max_length=255, verbose_name="O que você está editando")),
                ("kind", models.CharField(choices=[("html", "Texto"), ("image", "Imagem")], default="html", max_length=20, verbose_name="Tipo")),
                ("value", models.TextField(blank=True, verbose_name="Conteúdo atual")),
                ("uploaded_image", models.ImageField(blank=True, upload_to="pages/", verbose_name="Nova imagem")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Ordem")),
                ("is_active", models.BooleanField(default=True, verbose_name="Aplicar esta alteração")),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("page", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="elements", to="sitepages.sitepage", verbose_name="Página")),
            ],
            options={"verbose_name": "Conteúdo da página", "verbose_name_plural": "Conteúdos da página", "ordering": ["order", "id"]},
        ),
        migrations.AddConstraint(
            model_name="pageelement",
            constraint=models.UniqueConstraint(fields=("page", "key"), name="sitepages_page_element_unique"),
        ),
    ]
