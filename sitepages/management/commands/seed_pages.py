from pathlib import Path
import re

from bs4 import BeautifulSoup, Tag
from django.conf import settings
from django.core.management.base import BaseCommand

from sitepages.models import PageElement, SitePage


PAGES = [
    (0, "Página Inicial", "/", "legacy/index.html"),
    (10, "Informações", "/informacoes.html", "legacy/informacoes.html"),
    (20, "Eleições 2026", "/eleicoes-2026.html", "legacy/eleicoes-2026.html"),
    (30, "Conteúdo Interativo", "/conteudo-interativo.html", "legacy/conteudo-interativo.html"),
    (40, "Simulador", "/simulador.html", "legacy/simulador.html"),
    (50, "Flashcards", "/flashcards.html", "legacy/flashcards.html"),
    (60, "Você é o Senador", "/voce-e-o-senador.html", "legacy/voce-e-o-senador.html"),
    (70, "Quiz", "/quiz.html", "legacy/quiz.html"),
    (80, "Eventos", "/eventos.html", "legacy/eventos.html"),
    (90, "Sobre", "/sobre.html", "legacy/sobre.html"),
    (100, "Contato", "/contato.html", "legacy/contato.html"),
    (110, "Referências", "/referencias.html", "legacy/referencias.html"),
    (120, "Presidente", "/presidente.html", "legacy/presidente.html"),
    (130, "Governador", "/governador.html", "legacy/governador.html"),
    (140, "Senador", "/senador.html", "legacy/senador.html"),
    (150, "Deputado Federal", "/deputado-federal.html", "legacy/deputado-federal.html"),
    (160, "Candidatos a Presidente", "/candidatos-presidente.html", "legacy/candidatos-presidente.html"),
    (170, "Candidatos a Governador", "/candidatos-governador.html", "legacy/candidatos-governador.html"),
    (180, "Candidatos a Senador", "/candidatos-senador.html", "legacy/candidatos-senador.html"),
    (190, "Candidatos a Deputado Federal", "/candidatos-deputado-federal.html", "legacy/candidatos-deputado-federal.html"),
    (200, "Ana Carla Silva", "/ana-carla-silva.html", "legacy/ana-carla-silva.html"),
    (210, "Carlos Santos", "/carlos-santos.html", "legacy/carlos-santos.html"),
    (220, "Fernanda Lima", "/fernanda-lima.html", "legacy/fernanda-lima.html"),
    (230, "João Mendes", "/joao-mendes.html", "legacy/joao-mendes.html"),
    (240, "Maria Oliveira", "/maria-oliveira.html", "legacy/maria-oliveira.html"),
    (250, "Rafael Costa", "/rafael-costa.html", "legacy/rafael-costa.html"),
]

EDITABLE_TAGS = {
    "h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "blockquote", "cite", "td", "th", "caption", "time",
    "span", "strong", "em", "div", "img",
}
CONTAINER_TAGS = {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "blockquote", "cite", "td", "th", "caption", "time"}
SKIP_ANCESTOR_TAGS = {"script", "style", "noscript"}


def clean_text(text):
    return re.sub(r"\s+", " ", (text or "")).strip()


def stable_key(tag):
    if tag.get("data-edit-key"):
        return tag.get("data-edit-key")
    parts = []
    node = tag
    while isinstance(node, Tag) and node.name != "body":
        part = node.name.lower()
        if node.get("id"):
            part += "#" + str(node.get("id"))
            parts.insert(0, part)
            break
        parent = node.parent
        if isinstance(parent, Tag):
            peers = [c for c in parent.children if isinstance(c, Tag) and c.name == node.name]
            if len(peers) > 1:
                part += f":nth-of-type({peers.index(node) + 1})"
        parts.insert(0, part)
        node = parent
    return ">".join(parts)


def is_managed(tag):
    node = tag
    while isinstance(node, Tag):
        if node.name in SKIP_ANCESTOR_TAGS:
            return True
        if node.get("data-django-managed") == "true":
            return True
        node = node.parent
    return False


def is_editable(tag):
    if tag.name not in EDITABLE_TAGS or is_managed(tag):
        return False
    if tag.name == "div" and tag.find(recursive=False):
        return False
    if tag.name == "li" and tag.find(["a", "button", "input", "select", "textarea"]):
        return False
    if tag.name in {"span", "strong", "em"}:
        parent = tag.parent
        while isinstance(parent, Tag):
            if parent.name in CONTAINER_TAGS:
                return False
            if parent.name in {"body", "html"}:
                break
            parent = parent.parent
    if tag.name == "img":
        src = str(tag.get("src") or "").strip()
        return bool(src) and "{{" not in src and "{%" not in src
    text = clean_text(tag.get_text(" ", strip=True))
    if len(text) < 2:
        return False
    rendered = str(tag.decode_contents())
    # Conteúdo dinâmico continua sendo editado nos módulos próprios (Eventos, Notícias etc.).
    if "{{" in rendered or "{%" in rendered:
        return False
    return True


def label_for(tag):
    if tag.name == "img":
        base = clean_text(tag.get("alt")) or Path(str(tag.get("src") or "imagem")).name
        return f"Imagem — {base}"[:255]
    text = clean_text(tag.get_text(" ", strip=True))
    labels = {
        "h1": "Título principal", "h2": "Título", "h3": "Subtítulo", "h4": "Subtítulo",
        "p": "Texto", "li": "Item de lista", "blockquote": "Citação", "cite": "Fonte da citação",
        "td": "Célula", "th": "Cabeçalho da tabela", "caption": "Legenda da tabela", "time": "Data",
        "span": "Texto curto", "strong": "Destaque", "em": "Ênfase", "div": "Texto",
    }
    prefix = labels.get(tag.name, "Conteúdo")
    return f"{prefix} — {text[:95]}"[:255]


class Command(BaseCommand):
    help = "Cria as páginas editáveis do Admin a partir dos HTMLs atuais, sem sobrescrever edições existentes."

    def handle(self, *args, **options):
        template_root = Path(settings.BASE_DIR) / "templates"
        pages_created = 0
        elements_created = 0

        for order, name, path, template_name in PAGES:
            page, created = SitePage.objects.get_or_create(
                template_name=template_name,
                defaults={"name": name, "path": path, "order": order},
            )
            if created:
                pages_created += 1
            else:
                changed = False
                for field, value in (("name", name), ("path", path), ("order", order)):
                    if getattr(page, field) != value:
                        setattr(page, field, value)
                        changed = True
                if changed:
                    page.save(update_fields=["name", "path", "order", "updated_at"])

            file_path = template_root / template_name
            if not file_path.exists():
                self.stdout.write(self.style.WARNING(f"HTML não encontrado: {template_name}"))
                continue

            soup = BeautifulSoup(file_path.read_text(encoding="utf-8"), "html.parser")
            seq = 0
            for tag in soup.find_all(list(EDITABLE_TAGS)):
                if not is_editable(tag):
                    continue
                seq += 1
                kind = "image" if tag.name == "img" else "html"
                value = str(tag.get("src") or "") if kind == "image" else str(tag.decode_contents()).strip()
                _, el_created = PageElement.objects.get_or_create(
                    page=page,
                    key=stable_key(tag),
                    defaults={
                        "label": label_for(tag),
                        "kind": kind,
                        "value": value,
                        "order": seq,
                    },
                )
                if el_created:
                    elements_created += 1

        self.stdout.write(self.style.SUCCESS(
            f"Páginas prontas: {len(PAGES)} ({pages_created} novas). Campos criados: {elements_created}."
        ))
