import os
import re
from django.core.management.base import BaseCommand
from django.conf import settings
from candidates.models import Candidate

class Command(BaseCommand):
    help = 'Migra candidatos do arquivo JS para o banco de dados Django'

    def handle(self, *args, **options):
        js_path = r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\js\candidatos-data.js'
        
        self.stdout.write(f"Arquivo JS existe: {os.path.exists(js_path)}")
        
        if not os.path.exists(js_path):
            self.stderr.write("Arquivo JS não encontrado!")
            return
        
        with open(js_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        match = re.search(r'const CANDIDATOS_PRESIDENTE\s*=\s*(\[[\s\S]*?\]);', content)
        if not match:
            self.stderr.write("Array CANDIDATOS_PRESIDENTE não encontrado!")
            return
        
        js_array = match.group(1)
        # Converte JS object syntax para Python dict válido
        js_array = re.sub(r'(\w+)\s*:', r'"\1":', js_array)
        js_array = js_array.replace('true', 'True').replace('false', 'False').replace('null', 'None')
        
        candidatos = eval(js_array)
        
        self.stdout.write(f"Encontrados {len(candidatos)} candidatos no JS")
        
        count = 0
        for data in candidatos:
            obj, created = Candidate.objects.update_or_create(
                name=data['nome'],
                category='president',
                defaults={
                    'full_name': data.get('nomeCompleto', ''),
                    'party': data['partido'],
                    'party_name': data.get('partidoNome', ''),
                    'number': data['numero'],
                    'vice': data.get('vice', ''),
                    'vice_party': data.get('vicePartido', ''),
                    'coalition': data.get('coligacao', ''),
                    'birth_date': data.get('nascimento', ''),
                    'birthplace': data.get('naturalidade', ''),
                    'profession': data.get('profissao', ''),
                    'education': data.get('formacao', ''),
                    'trajectory': data.get('trajetoria', ''),
                    'status_tse': data.get('statusTSE', 'Validado'),
                    'photo': data.get('foto', ''),
                    'proposals': data.get('propostas', {}),
                    'order': data['id'],
                    'is_active': True,
                }
            )
            action = "Criado" if created else "Atualizado"
            self.stdout.write(f"  {action}: {obj.name} ({obj.party})")
            count += 1
        
        self.stdout.write(self.style.SUCCESS(f"\n[OK] Migracao concluida: {count} candidatos processados."))