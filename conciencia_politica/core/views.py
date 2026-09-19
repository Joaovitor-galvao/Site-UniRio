from django.views.generic import TemplateView, ListView
from candidates.models import Candidate
from content.models import ContentBlock


class HomeView(TemplateView):
    template_name = 'core/home.html'

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['featured_presidents'] = Candidate.objects.filter(
            category='president', is_active=True
        ).order_by('order')[:4]
        ctx['featured_governors'] = Candidate.objects.filter(
            category='governor', is_active=True
        ).order_by('order')[:4]
        return ctx


class ContentPageView(TemplateView):
    """Páginas institucionais editáveis via ContentBlock (sobre, eventos, contato, etc.)"""

    def get_template_names(self):
        slug = self.kwargs.get('slug', '')
        return [f'core/page_{slug}.html', 'core/page_generic.html']

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        slug = self.kwargs.get('slug', '')
        ctx['page_slug'] = slug
        ctx['page_blocks'] = ContentBlock.objects.filter(key__startswith=f'{slug}_')
        return ctx