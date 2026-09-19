from django.views.generic import ListView, DetailView
from django.http import JsonResponse
from django.views import View
from .models import Candidate


class CandidateListView(ListView):
    model = Candidate
    template_name = 'candidates/list.html'
    context_object_name = 'candidates'
    paginate_by = 12

    def get_queryset(self):
        qs = Candidate.objects.filter(is_active=True)
        category = self.kwargs.get('category')
        if category:
            qs = qs.filter(category=category)
        return qs.select_related()

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx['current_category'] = self.kwargs.get('category')
        ctx['category_choices'] = Candidate.CATEGORY_CHOICES
        return ctx


class CandidateDetailView(DetailView):
    model = Candidate
    template_name = 'candidates/detail.html'
    context_object_name = 'candidate'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'

    def get_queryset(self):
        return Candidate.objects.filter(is_active=True)


class CandidateAPIView(View):
    def get(self, request):
        category = request.GET.get('category')
        qs = Candidate.objects.filter(is_active=True)
        if category:
            qs = qs.filter(category=category)
        data = list(qs.values(
            'id', 'name', 'full_name', 'party', 'party_name', 'number',
            'vice', 'vice_party', 'coalition', 'category', 'state',
            'birth_date', 'birthplace', 'profession', 'education',
            'trajectory', 'status_tse', 'proposals', 'photo'
        ))
        for item in data:
            if item['photo']:
                item['photo_url'] = request.build_absolute_uri(item['photo'])
        return JsonResponse({'candidates': data})