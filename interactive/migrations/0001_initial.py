# Generated migration for interactive app models
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='QuizQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.TextField(verbose_name='Pergunta')),
                ('options', models.JSONField(help_text='[{"text": "Opcao A", "correct": true}, {"text": "Opcao B", "correct": false}]', verbose_name='Opcoes')),
                ('explanation', models.TextField(blank=True, verbose_name='Explicacao')),
                ('category', models.CharField(default='Geral', max_length=50, verbose_name='Categoria')),
                ('order', models.IntegerField(default=0, verbose_name='Ordem')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativo')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
            ],
            options={
                'verbose_name': 'Pergunta do Quiz',
                'verbose_name_plural': 'Perguntas do Quiz',
                'ordering': ['order', 'id'],
            },
        ),
        migrations.CreateModel(
            name='SimulatorScenario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Titulo')),
                ('description', models.TextField(verbose_name='Descricao')),
                ('steps', models.JSONField(help_text='Estrutura JSON do simulador', verbose_name='Passos/Etapas')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativo')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
            ],
            options={
                'verbose_name': 'Cenario do Simulador',
                'verbose_name_plural': 'Cenarios do Simulador',
            },
        ),
        migrations.CreateModel(
            name='Flashcard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('front', models.TextField(verbose_name='Frente')),
                ('back', models.TextField(verbose_name='Verso')),
                ('category', models.CharField(max_length=50, verbose_name='Categoria')),
                ('order', models.IntegerField(default=0, verbose_name='Ordem')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativo')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Criado em')),
            ],
            options={
                'verbose_name': 'Flashcard',
                'verbose_name_plural': 'Flashcards',
                'ordering': ['category', 'order'],
            },
        ),
        migrations.CreateModel(
            name='SenatorGameData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200, verbose_name='Titulo do Cenario')),
                ('scenario', models.TextField(verbose_name='Cenario/Contexto')),
                ('options', models.JSONField(help_text=r'[{"text": "Opcao", "effects": {"...": "..."}}]', verbose_name='Opcoes'),
                ('consequences', models.JSONField(blank=True, default=dict, verbose_name='Consequencias')),
                ('order', models.IntegerField(default=0, verbose_name='Ordem')),
                ('is_active', models.BooleanField(default=True, verbose_name='Ativo')),
            ],
            options={
                'verbose_name': 'Cenario - Voce e o Senador',
                'verbose_name_plural': 'Cenarios - Voce e o Senador',
                'ordering': ['order'],
            },
        ),
    ]
)