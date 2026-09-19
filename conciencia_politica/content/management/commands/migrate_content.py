import os
from django.core.management.base import BaseCommand
from content.models import ContentBlock

class Command(BaseCommand):
    help = 'Cria blocos de conteúdo padrão para o site'

    def handle(self, *args, **options):
        BLOCKS = [
            {'key': 'hero', 'label': 'Hero - Titulo/Subtitulo/Botao', 'content_type': 'html',
             'help_text': 'Use <br> para quebras de linha. Ex: "Titulo<br>Subtitulo"'},
            
            {'key': 'apresentacao', 'label': 'Apresentacao - Texto principal', 'content_type': 'html'},
            {'key': 'objetivos', 'label': 'Objetivos - Lista', 'content_type': 'list',
             'help_text': 'Um objetivo por linha'},
            
            {'key': 'equipe', 'label': 'Equipe - Membros', 'content_type': 'list',
             'help_text': 'Formato: "Nome - Cargo" (um por linha)'},
            
            {'key': 'eventos', 'label': 'Eventos - Lista', 'content_type': 'list',
             'help_text': 'Formato: "Nome - Data - Local" (um por linha)'},
            
            {'key': 'noticias', 'label': 'Noticias - Lista', 'content_type': 'list',
             'help_text': 'Formato: "Titulo - Data - Descricao" (um por linha)'},
            
            {'key': 'cards', 'label': 'Cards Destaque - Lista', 'content_type': 'list',
             'help_text': 'Formato: "Titulo - Descricao - Link" (um por linha)'},
            
            {'key': 'footer', 'label': 'Rodape - Texto', 'content_type': 'html'},
            
            {'key': 'sobre_titulo', 'label': 'Sobre - Titulo', 'content_type': 'text'},
            {'key': 'sobre_texto', 'label': 'Sobre - Texto', 'content_type': 'html'},
            {'key': 'eventos_titulo', 'label': 'Eventos - Titulo', 'content_type': 'text'},
            {'key': 'contato_titulo', 'label': 'Contato - Titulo', 'content_type': 'text'},
            {'key': 'contato_texto', 'label': 'Contato - Texto', 'content_type': 'html'},
            {'key': 'informacoes_titulo', 'label': 'Informacoes - Titulo', 'content_type': 'text'},
            {'key': 'informacoes_texto', 'label': 'Informacoes - Texto', 'content_type': 'html'},
            {'key': 'referencias_titulo', 'label': 'Referencias - Titulo', 'content_type': 'text'},
            {'key': 'referencias_texto', 'label': 'Referencias - Texto', 'content_type': 'html'},
            {'key': 'eleicoes_titulo', 'label': 'Eleicoes 2026 - Titulo', 'content_type': 'text'},
            {'key': 'eleicoes_texto', 'label': 'Eleicoes 2026 - Texto', 'content_type': 'html'},
            {'key': 'interativo_titulo', 'label': 'Interativo - Titulo', 'content_type': 'text'},
            {'key': 'interativo_texto', 'label': 'Interativo - Texto', 'content_type': 'html'},
        ]

        count = 0
        for block_data in BLOCKS:
            obj, created = ContentBlock.objects.get_or_create(
                key=block_data['key'],
                defaults=block_data
            )
            action = "Criado" if created else "Ja existe"
            self.stdout.write(f"  {action}: {obj.key} - {obj.label}")
            count += 1
        
        self.stdout.write(self.style.SUCCESS(f"\n[OK] Migracao de conteudo concluida: {count} blocos processados."))