"""
Django settings for conciencia_politica project.
"""
import os

ENV = os.getenv('DJANGO_ENV', 'development').lower()

if ENV == 'production':
    from .production import *
else:
    from .development import *