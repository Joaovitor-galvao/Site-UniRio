#!/usr/bin/env python
"""
Script standalone para migrar candidatos - executa diretamente sem manage.py shell
"""
import os
import sys
import re

# Configura Django
os.chdir(r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\conciencia_politica')
sys.path.insert(0, r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\conciencia_politica')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conciencia_politica.settings.development')

import django
django.setup()

from candidates.models import Candidate

# Caminho do arquivo JS
js_path = r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\js\candidatos-data.js'

print(f"Arquivo JS existe: {os.path.exists(js_path)}")

if not os.path.exists(js_path):
    print("Arquivo JS não encontrado!")
    sys.exit(1)

# Lê e parseia o JS
with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

match = re.search(r'const CANDIDATOS_PRESIDENTE\s*=\s*(\[[\s\S]*?\]);', content)
if not match:
    print("Array CANDIDATOS_PRESIDENTE não encontrado!")
    sys.exit(1)

js_array = match.group(1)

# Converte JS object syntax para Python dict válido
# Adiciona aspas nas chaves que não têm
import re
js_array = re.sub(r'(\w+)\s*:', r'"\1":', js_array)
js_array = js_array.replace('true', 'True').replace('false', 'False').replace('null', 'None')

print("Array JS convertido para Python dict")
candidatos = eval(js_array)

print(f"Encontrados {len(candidatos)} candidatos no JS")

from candidates.models import Candidate

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
    print(f"  {action}: {obj.name} ({obj.party})")
    count += 1

print(f"\n✅ Migração concluída: {count} candidatos processados.")