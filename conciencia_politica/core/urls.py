from django.urls import path
from .views import HomeView, ContentPageView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    # Páginas dinâmicas: /sobre/, /eventos/, /contato/, etc.
    path('<slug:slug>/', ContentPageView.as_view(), name='content_page'),
]