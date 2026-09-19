import os
import sys

# Add the proyecto directory to Python path
sys.path.insert(0, r'C:\Users\Paulo\OneDrive\Desktop\site joao\site joao\Site-UniRio\conciencia_politica')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'conciencia_politica.settings.development')

import django
django.setup()

print('Django setup OK')
print('Apps installed:')
for app in django.apps.apps.get_models():
    print(f'  - {app.__module__}')

# Try importing core urls
try:
    from core import urls
    print('core.urls import OK')
except ImportError as e:
    print(f'core.urls import failed: {e}')

# Try importing candidates urls
try:
    from candidates import urls
    print('candidates.urls import OK')
except ImportError as e:
    print(f'candidates.urls import failed: {e}')