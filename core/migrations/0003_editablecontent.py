from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("core", "0002_seed_current_content")]
    operations = [
        migrations.CreateModel(
            name="EditableContent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("page", models.CharField(db_index=True, max_length=255, verbose_name="Página")),
                ("key", models.CharField(max_length=500, verbose_name="Chave do elemento")),
                ("label", models.CharField(blank=True, max_length=255, verbose_name="Descrição")),
                ("kind", models.CharField(choices=[("html", "Texto/HTML"), ("image", "Imagem")], default="html", max_length=20, verbose_name="Tipo")),
                ("value", models.TextField(verbose_name="Conteúdo")),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={"verbose_name": "Conteúdo editável", "verbose_name_plural": "Conteúdos editáveis", "ordering": ["page", "key"]},
        ),
        migrations.AddConstraint(
            model_name="editablecontent",
            constraint=models.UniqueConstraint(fields=("page", "key"), name="editable_content_page_key_unique"),
        ),
    ]
