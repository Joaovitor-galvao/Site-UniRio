#!/usr/bin/env python
"""Conciencia Politica - Django Project Management Script"""
import os
import sys

# Ensure the projeto directory takes precedence in the Python path
projeto_dir = r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\conciencia_politica'
if projeto_dir not in sys.path:
    sys.path.insert(0, projeto_dir)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conciencia_politica.settings.development')

try:
    from django.core.management import execute_from_command_line
except ImportError as exc:
    raise ImportError(
        "Couldn't import Django. Are you sure it's installed and "
        "available on your PYTHONPATH environment variable? Did you "
        "forget to activate a virtual environment?"
    ) from exc
execute_from_command_line(sys.argv)