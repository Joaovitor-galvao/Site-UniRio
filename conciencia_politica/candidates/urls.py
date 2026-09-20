from django.urls import path
from .views import CandidateListView, CandidateDetailView, CandidateAPIView

urlpatterns = [
    path('', CandidateListView.as_view(), name='candidate_list_all'),
    path('categoria/<str:category>/', CandidateListView.as_view(), name='candidate_list'),
    path('<slug:candidate_slug>/', CandidateDetailView.as_view(), name='candidate_detail'),
    path('api/', CandidateAPIView.as_view(), name='candidate_api'),
]