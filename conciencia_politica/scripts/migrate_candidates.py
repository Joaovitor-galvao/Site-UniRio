#!/usr/bin/env python
"""
Migra dados de candidatos do js/candidatos-data.js para o Django.
Uso: python manage.py shell < scripts/migrate_candidates.py
"""
import json
import re
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conciencia_politica.settings.development')
django.setup()

from candidates.models import Candidate

def extract_candidates_from_js(js_path):
    """Extrai array CANDIDATOS_PRESIDENTE do arquivo JS."""
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex para encontrar o array
    match = re.search(r'const CANDIDATOS_PRESIDENTE\s*=\s*(\[[\s\S]*?\]);', content)
    if not match:
        raise ValueError("Array CANDIDATOS_PRESIDENTE não encontrado")
    
    js_array = match.group(1)
    # Substitui chaves JS por Python dict
    js_array = js_array.replace('true', 'True').replace('false', 'False').replace('null', 'None')
    candidates = eval(js_array)  # Cuidado: só use em arquivos confiáveis
    return candidates

def migrate():
    # Caminho para o arquivo JS na raiz do projeto
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    js_path = os.path.join(base_dir, '..', 'js', 'candidatos-data.js')
    js_path = os.path.normpath(js_path)
    
    print(f"Procurando JS em: {js_path}")
    print(f"Existe: {os.path.exists(js_path)}")
    
    if not os.path.exists(js_path):
        print(f"Arquivo JS não encontrado: {js_path}")
        # Tenta caminho alternativo
        alt_path = r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\js\candidatos-data.js'
        print(f"Tentando caminho alternativo: {alt_path}")
        print(f"Existe: {os.path.exists(alt_path)}")
        if os.path.exists(alt_path):
            js_path = alt_path
        else:
            print("Arquivo JS não encontrado!")
            return
    
    print(f"Lendo: {js_path}")
    try:
        candidatos = extract_candidates_from_js(js_path)
        print(f"Encontrados {len(candidatos)} candidatos no JS")
    except Exception as e:
        print(f"Erro ao ler JS: {e}")
        import traceback
        traceback.print_exc()
        return
    
    count = 0
    for data in candidatos:
        print(f"Processando: {data.get('nome', 'SEM NOME')}")
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

def extract_candidates_from_js(js_path):
    """Extrai array CANDIDATOS_PRESIDENTE do arquivo JS."""
    with open(js_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex para encontrar o array
    match = re.search(r'const CANDIDATOS_PRESIDENTE\s*=\s*(\[[\s\S]*?\]);', content)
    if not match:
        raise ValueError("Array CANDIDATOS_PRESIDENTE não encontrado")
    
    js_array = match.group(1)
    # Substitui chaves JS por Python dict
    js_array = js_array.replace('true', 'True').replace('false', 'False').replace('null', 'None')
    candidates = eval(js_array)  # Cuidado: só use em arquivos confiáveis
    return candidates

if __name__ == '__main__':
    import os
    import re
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conciencia_politica.settings.development')
    django.setup()
    from candidates.models import Candidate
    migrate()