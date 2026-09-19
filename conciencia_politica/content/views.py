from django.views.generic import TemplateView
from .models import ContentBlock


class ContentPageView(TemplateView):
    """Páginas institucionais dinâmicas baseadas em slug."""

    def get_template_names(self):
        slug = self.kwargs.get('slug', '')
        template_map = {
            'sobre': 'content/page_sobre.html',
            'eventos': 'content/page_eventos.html',
            'contato': 'content/page_contato.html',
            'informacoes': 'content/page_informacoes.html',
            'referencias': 'content/page_referencias.html',
            'eleicoes-2026': 'content/page_eleicoes.html',
            'conteudo-interativo': 'content/page_interativo.html',
        }
        specific = template_map.get(slug)
        return [specific, 'content/page_generic.html'] if specific else ['content/page_generic.html']

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        slug = self.kwargs.get('slug', '')
        ctx['page_slug'] = slug
        ctx['page_blocks'] = ContentBlock.objects.filter(key__startswith=f'{slug}_')
        return ctx