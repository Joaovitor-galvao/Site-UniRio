# Dockerfile para Consciência Política - Django
# Multi-stage build para imagem menor

# ===========================================
# STAGE 1: Builder - instala dependências
# ===========================================
FROM python:3.11-slim as builder

# Variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Diretório de trabalho
WORKDIR /app

# Copiar requirements primeiro (cache de layer)
COPY requirements.txt .

# Instalar dependências Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ===========================================
# STAGE 2: Runtime - imagem final leve
# ===========================================
FROM python:3.11-slim as runtime

# Variáveis de ambiente
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=conciencia_politica.settings.production

# Instalar dependências runtime mínimas
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    gettext \
    && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root
RUN groupadd -r django && useradd -r -g django django

# Diretório de trabalho
WORKDIR /app

# Copiar dependências do builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copiar código da aplicação
COPY --chown=django:django . .

# Criar diretórios necessários
RUN mkdir -p /app/staticfiles /app/media && \
    chown -R django:django /app/staticfiles /app/media

# Coletar arquivos estáticos
RUN python manage.py collectstatic --noinput

# Mudar para usuário não-root
USER django

# Porta exposta
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/admin/')" || exit 1

# Comando de inicialização
CMD ["gunicorn", "conciencia_politica.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]