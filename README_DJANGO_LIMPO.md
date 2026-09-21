# Django limpo — CON(S)CIÊNCIA POLÍTICA

Este projeto foi reconstruído a partir do ZIP estático enviado em 20/09/2026.

## Princípios
- O visual e os HTMLs originais foram tratados como fonte de verdade.
- O Django antigo/duplicado do ZIP original não foi reutilizado.
- URLs antigas `.html` continuam funcionando.
- As páginas individuais de presidentes e governadores são dinâmicas e editáveis pelo Django Admin.
- Existem 21 candidatos na base inicial (12 presidentes e 9 governadores).

## Primeira execução
```bash
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py seed_candidates
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:3000
```

Admin: `/admin/`

## Importante
As páginas institucionais e interativas são servidas pelo Django usando os HTMLs originais, com CSS/JS/imagens em `/static/`. O admin nesta primeira base limpa controla os candidatos.
