from django.urls import path
from .views import ContentPageView

urlpatterns = [
    path('<slug:page_slug>/', ContentPageView.as_view(), name='content_page'),
]