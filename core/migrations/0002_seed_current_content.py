from datetime import date
from django.db import migrations


def seed_content(apps, schema_editor):
    Event = apps.get_model("core", "Event")
    News = apps.get_model("core", "News")
    TeamSlide = apps.get_model("core", "TeamSlide")

    events = [
        ("Oficina: Educação Política", date(2026, 4, 15), "Auditório UNIRIO", "Aprenda sobre o sistema eleitoral brasileiro de forma prática e interativa."),
        ("Palestra: O Papel do Presidente", date(2026, 4, 25), "Online (YouTube UNIRIO)", "Entenda as responsabilidades e limites do cargo de Presidente da República."),
        ("Seminário: Democracia e Participação", date(2026, 5, 10), "Centro de Ciências Jurídicas", "Debate sobre a importância da participação cidadã na construção da democracia."),
        ("Simulação: Você é o Senador", date(2026, 5, 20), "Laboratório de Ciência Política", "Vivencie na prática o dia a dia de um Senador da República."),
    ]
    for title, event_date, location, description in events:
        Event.objects.get_or_create(
            title=title,
            date=event_date,
            defaults={"location": location, "description": description, "is_active": True, "show_on_home": True},
        )

    news = [
        ("Lançamento do portal Voto Consciente", date(2026, 3, 1), "O projeto oficializa sua plataforma digital com conteúdos educativos e interativos para as Eleições 2026."),
        ("Oficina de Educação Política na UNIRIO", date(2026, 3, 10), "Inscrições abertas para a oficina que será realizada no dia 15 de abril. Vagas limitadas!"),
    ]
    for title, published_at, summary in news:
        News.objects.get_or_create(
            title=title,
            published_at=published_at,
            defaults={"summary": summary, "is_active": True, "show_on_home": True},
        )

    slides = [
        (1, "Coordenação", "Profª. Dra. Ana Carla Silva\nProf. Dr. João Mendes", "imagens/equipe/coordenacao.jpg", "Equipe de coordenação"),
        (2, "Professores Responsáveis", "Profª. Dra. Maria Oliveira\nProf. Dr. Carlos Santos", "imagens/equipe/professores.jpg", "Professores responsáveis"),
        (3, "Pesquisadores", "Dra. Fernanda Lima\nMe. Rafael Costa", "imagens/equipe/pesquisadores.jpg", "Pesquisadores"),
        (4, "Bolsistas", "10 estudantes de graduação e pós-graduação", "imagens/equipe/bolsistas.jpg", "Bolsistas"),
        (5, "Parceiros", "TSE, Justiça Eleitoral e DivulgaCand", "imagens/equipe/parceiros.jpg", "Parceiros do projeto"),
        (6, "Escola de Ciência Política", "UNIRIO — Centro de Ciências Jurídicas e Políticas", "imagens/equipe/escola.jpg", "Escola de Ciência Política"),
    ]
    for order, title, text, static_image, alt_text in slides:
        TeamSlide.objects.get_or_create(
            order=order,
            title=title,
            defaults={
                "text": text,
                "static_image": static_image,
                "alt_text": alt_text,
                "is_active": True,
            },
        )


def unseed_content(apps, schema_editor):
    Event = apps.get_model("core", "Event")
    News = apps.get_model("core", "News")
    TeamSlide = apps.get_model("core", "TeamSlide")
    Event.objects.filter(title__in=[
        "Oficina: Educação Política",
        "Palestra: O Papel do Presidente",
        "Seminário: Democracia e Participação",
        "Simulação: Você é o Senador",
    ]).delete()
    News.objects.filter(title__in=[
        "Lançamento do portal Voto Consciente",
        "Oficina de Educação Política na UNIRIO",
    ]).delete()
    TeamSlide.objects.filter(order__in=[1, 2, 3, 4, 5, 6]).delete()


class Migration(migrations.Migration):
    dependencies = [("core", "0001_initial")]
    operations = [migrations.RunPython(seed_content, unseed_content)]
