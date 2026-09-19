# CON(S)CIÊNCIA POLÍTICA — Django

Site de educação política para voto consciente (UNIRIO).

## 🚀 Setup Local

```bash
# 1. Clone e entre na pasta
git clone <repo-url>
cd conciencia_politica

# 2. Crie venv e instale deps
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows
pip install -r requirements.txt

# 3. Configure variáveis
cp .env.example .env
# Edite .env com sua SECRET_KEY

# 4. Banco + admin
python manage.py migrate
python manage.py createsuperuser

# 5. Migre dados (opcional, mas recomendado)
python manage.py shell < scripts/migrate_candidates.py
python manage.py shell < scripts/migrate_content.py
python manage.py shell < scripts/migrate_interactive.py

# 6. Colete static files
python manage.py collectstatic --noinput

# 7. Rode
python manage.py runserver
# Acesse: http://localhost:8000
# Admin: http://localhost:8000/admin
```

## 📦 Apps

| App | Responsabilidade |
|-----|------------------|
| `core` | Home, páginas institucionais dinâmicas |
| `candidates` | CRUD de candidatos (Presidente, Gov, Dep, Senador) |
| `content` | Blocos editáveis (hero, footer, textos de páginas) |
| `interactive` | Quiz, Simulador, Flashcards, Você é o Senador |
| `accounts` | (Opcional - user custom, deixa pra depois) |

## 🛠️ Admin

- `/admin/` — Django Admin nativo
- Candidatos: filtros por cargo, partido, estado; busca por nome/número
- Conteúdo: blocos por chave (hero, footer, sobre_texto, etc.)
- Interativo: perguntas, cenários, flashcards

## 🌐 Deploy (Railway/Render)

1. Conecte repo no Railway/Render
2. Adicione PostgreSQL
3. Configure variáveis de ambiente (`.env.example`)
4. Deploy automático no `git push`

## 📁 Static/Media

- `python manage.py collectstatic` → `staticfiles/` (WhiteNoise serve em prod)
- `media/` → uploads de fotos (configure S3/R2 em produção)

## 🔧 Comandos Úteis

```bash
# Nova migração
python manage.py makemigrations

# Shell Django
python manage.py shell

# Testes
python manage.py test

# Superuser
python manage.py createsuperuser

# Reset DB (cuidado!)
rm db.sqlite3 && python manage.py migrate
```