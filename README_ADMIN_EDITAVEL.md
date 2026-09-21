# Admin editável — CON(S)CIÊNCIA POLÍTICA

Este projeto agora usa o Django Admin como fonte oficial de conteúdo editável.

## O que ficou editável pelo `/admin/`

- **Candidatos**: já existiam no banco e agora as listas de Presidente e Governador também são renderizadas diretamente do banco.
- **Eventos**: título, data, local, descrição, link, ativo/inativo e exibição na home.
- **Notícias**: título, resumo, data, link, ativo/inativo e exibição na home.
- **Equipe**: cada slide do carrossel pode ser editado, reordenado, ativado/desativado e receber imagem.

A home e a página de Eventos leem esses registros diretamente do banco. Isso elimina a necessidade de abrir os HTMLs para atualizar esses conteúdos.

## Rodar localmente

No terminal, dentro da pasta do projeto:

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Linux/macOS:

```bash
source .venv/bin/activate
```

Depois:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_candidates
python manage.py runserver 0.0.0.0:3000
```

Abra:

- Site: `http://127.0.0.1:3000/`
- Admin: `http://127.0.0.1:3000/admin/`

O banco enviado no ZIP já contém o conteúdo inicial migrado. Mesmo assim, rode `python manage.py migrate` após puxar alterações do projeto, porque isso também garante que permissões e futuras migrações sejam aplicadas.

## Criar outro administrador

```bash
python manage.py createsuperuser
```

Cada pessoa pode ter seu próprio usuário. Não compartilhem a mesma senha de administrador.

## Como funciona quando estiver online

Localmente, sem configuração adicional, o Django usa `db.sqlite3`.

Em produção, defina a variável `DATABASE_URL` com a URL do PostgreSQL fornecida pela hospedagem. Quando ela existir, o projeto troca automaticamente do SQLite para PostgreSQL.

Exemplo de formato:

```text
postgresql://usuario:senha@host:5432/banco?sslmode=require
```

Também configure:

```text
DJANGO_DEBUG=false
DJANGO_SECRET_KEY=uma-chave-grande-e-secreta
DJANGO_ALLOWED_HOSTS=seu-dominio.com,www.seu-dominio.com
DJANGO_CSRF_TRUSTED_ORIGINS=https://seu-dominio.com,https://www.seu-dominio.com
```

Há um `.env.example` no projeto mostrando as variáveis.

### Comandos de publicação

Build/deploy:

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_candidates
python manage.py collectstatic --noinput
```

Start:

```bash
gunicorn config.wsgi:application
```

O `Procfile` já contém o comando de start.


### Candidatos em um banco novo

O banco PostgreSQL começa vazio. Depois do `migrate`, execute:

```bash
python manage.py seed_candidates
```

O comando cria somente os candidatos que estiverem faltando e **não sobrescreve edições feitas no Admin**. Se algum dia vocês quiserem deliberadamente restaurar os dados do arquivo `seed_candidates.json`, use `python manage.py seed_candidates --update`.

## Por que isso resolve o problema de vocês

Com o site hospedado, os dois acessam o mesmo `/admin/`, e o Django grava as alterações no mesmo PostgreSQL. Assim, uma edição feita por um computador aparece para qualquer pessoa que acesse o site, sem alterar manualmente HTML no PC de cada integrante.

## Importante sobre imagens

O banco PostgreSQL compartilha os dados, mas arquivos enviados pelo Admin (imagens) também precisam de armazenamento persistente no servidor ou em um serviço de arquivos. Em hospedagens com disco efêmero, não dependam de uploads locais sem configurar armazenamento persistente.

As imagens que já estão em `/static/` continuam funcionando normalmente porque fazem parte do código do projeto.

## Arquivos antigos de Admin/Firebase

Existem alguns JS antigos em `static/js/` relacionados ao sistema anterior de localStorage/Firebase. Eles foram mantidos para não apagar histórico do projeto, porém **não são usados pelo site atual**. O Admin oficial agora é o Django Admin em `/admin/`.
