# Admin por página — CON(S)CIÊNCIA POLÍTICA

A edição do conteúdo agora fica centralizada no Django Admin (`/admin/`).

## Páginas do site

No menu **PÁGINAS DO SITE > Páginas do site**, cada HTML aparece como uma página separada (Página Inicial, Informações, Simulador, Flashcards, Você é o Senador etc.).

Ao abrir uma página, o administrador pode:

- trocar as cores específicas daquela página por seletores visuais;
- editar textos da página;
- trocar imagens por upload;
- ativar/desativar uma alteração;
- usar CSS personalizado apenas em casos avançados.

O antigo módulo técnico **Conteúdos editáveis** não aparece mais no Admin, e o editor visual sobre o site foi removido.

## Deploy

O `Procfile` executa automaticamente:

1. `migrate`;
2. `seed_candidates`;
3. `seed_pages`;
4. `collectstatic`;
5. Gunicorn.

`seed_pages` cria a estrutura do Admin a partir dos HTMLs existentes e **não sobrescreve edições já salvas**.
