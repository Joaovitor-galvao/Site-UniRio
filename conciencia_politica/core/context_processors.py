"""
Injeta variáveis globais em todos os templates.
"""
from content.models import ContentBlock
from candidates.models import Candidate

def site_settings(request):
    blocks = ContentBlock.objects.all()
    return {
        'content_blocks': {b.key: b for b in blocks},
        'site_name': 'CON(S)CIÊNCIA POLÍTICA',
        'site_tagline': 'VOTO CONSCIENTE — UNIRIO',
    }

def candidate_counts(request):
    return {
        'candidate_counts': {
            'president': Candidate.objects.filter(category='president', is_active=True).count(),
            'governor': Candidate.objects.filter(category='governor', is_active=True).count(),
            'deputy_federal': Candidate.objects.filter(category='deputy_federal', is_active=True).count(),
            'senator': Candidate.objects.filter(category='senator', is_active=True).count(),
        }
    }