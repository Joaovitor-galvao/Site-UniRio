"""
WSGI config for consciense_politica project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conciencia_politica.settings.development')

application = get_wsgi_application()