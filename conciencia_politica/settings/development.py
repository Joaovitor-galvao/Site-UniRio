"""
Django settings for conciencia_politica project - Development.
"""
import os
from .base import *

# SECURITY WARNING: don't run with debug turned off in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Database - SQLite para desenvolvimento
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Email console para desenvolvimento
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Desabilita cache em dev
CACHES = {
    'default': {'BACKEND': 'django.core.cache.backends.dummy.DummyCache'}
}

# Desabilita SSL em dev
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False