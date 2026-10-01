from datetime import date

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import Event, News, TeamSlide


class PublicContentTests(TestCase):
    def setUp(self):
        self.event = Event.objects.create(
            title="Evento de teste",
            date=date(2026, 10, 1),
            location="UNIRIO",
            description="Descrição do evento.",
        )
        self.news = News.objects.create(
            title="Notícia de teste",
            published_at=date(2026, 9, 20),
            summary="Resumo da notícia.",
        )
        self.slide = TeamSlide.objects.create(
            title="Equipe de teste",
            text="Pessoa 1\nPessoa 2",
            order=1,
        )

    def test_home_uses_database_content(self):
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Evento de teste")
        self.assertContains(response, "Notícia de teste")
        self.assertContains(response, "Equipe de teste")

    def test_events_page_uses_database_content(self):
        response = self.client.get(reverse("events"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Evento de teste")


class AdminAccessTests(TestCase):
    def test_admin_login_page_exists(self):
        response = self.client.get("/admin/login/")
        self.assertEqual(response.status_code, 200)

    def test_superuser_can_open_admin(self):
        User = get_user_model()
        user = User.objects.create_superuser("admin-test", "admin@example.com", "senha-forte-teste")
        self.client.force_login(user)
        response = self.client.get("/admin/")
        self.assertEqual(response.status_code, 200)
