from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Event",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=200, verbose_name="Título")),
                ("date", models.DateField(verbose_name="Data")),
                ("location", models.CharField(max_length=240, verbose_name="Local")),
                ("description", models.TextField(verbose_name="Descrição")),
                ("link", models.URLField(blank=True, verbose_name="Link")),
                ("is_active", models.BooleanField(default=True, verbose_name="Ativo")),
                ("show_on_home", models.BooleanField(default=True, verbose_name="Mostrar na página inicial")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Evento", "verbose_name_plural": "Eventos", "ordering": ["date", "title"]},
        ),
        migrations.CreateModel(
            name="News",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=220, verbose_name="Título")),
                ("summary", models.TextField(verbose_name="Resumo")),
                ("published_at", models.DateField(verbose_name="Data de publicação")),
                ("link", models.URLField(blank=True, verbose_name="Link")),
                ("is_active", models.BooleanField(default=True, verbose_name="Ativa")),
                ("show_on_home", models.BooleanField(default=True, verbose_name="Mostrar na página inicial")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Notícia", "verbose_name_plural": "Notícias", "ordering": ["-published_at", "-id"]},
        ),
        migrations.CreateModel(
            name="TeamSlide",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=180, verbose_name="Título do slide")),
                ("text", models.TextField(help_text="Use uma linha para cada nome ou informação que deve aparecer no slide.", verbose_name="Texto")),
                ("image", models.ImageField(blank=True, upload_to="team/", verbose_name="Imagem enviada")),
                ("static_image", models.CharField(blank=True, help_text="Caminho dentro de /static/, por exemplo: imagens/equipe/coordenacao.jpg", max_length=300, verbose_name="Imagem estática")),
                ("alt_text", models.CharField(blank=True, max_length=220, verbose_name="Texto alternativo")),
                ("order", models.PositiveIntegerField(default=0, verbose_name="Ordem")),
                ("is_active", models.BooleanField(default=True, verbose_name="Ativo")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Slide da equipe", "verbose_name_plural": "Slides da equipe", "ordering": ["order", "id"]},
        ),
    ]
