# Configuração Firebase + GitHub Pages

Este documento explica como configurar o Firebase Realtime Database para sincronizar o conteúdo do painel admin entre todos os usuários em tempo real.

---

## 1. Criar Projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em **"Adicionar projeto"**
3. Nome sugerido: `conscienpolitica-unirio` (ou similar)
4. **Desative** Google Analytics (opcional, não necessário)
5. Clique em **"Criar projeto"**

---

## 2. Ativar Realtime Database

1. No menu lateral: **Build → Realtime Database**
2. Clique em **"Criar banco de dados"**
3. Localização: escolha a mais próxima (ex: `us-central1` ou `southamerica-east1`)
4. **Modo de teste** → **"Ativar"**
   - As regras serão ajustadas depois
5. Após criar, **copie a URL do banco** (ex: `https://seu-projeto-default-rtdb.firebaseio.com`)
   - Essa será a variável `FIREBASE_DATABASE_URL`

---

## 3. Ativar Authentication Anônimo

1. No menu lateral: **Build → Authentication**
2. Aba **"Sign-in method"**
3. Clique em **"Anônimo"**
4. Ative a opção **"Ativar"**
5. Salve

> Isso permite que o script `storage.js` autentique automaticamente cada visitante sem login visível, satisfazendo a regra `auth != null`.

---

## 4. Configurar Regras de Segurança

1. No **Realtime Database** → Aba **"Regras"**
2. Substitua pelo conteúdo abaixo:
```json
{
  "rules": {
    "votoConscienteContent": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```
3. Clique em **"Publicar"**

**O que faz:**
- `.read: true` → Qualquer um pode ler o conteúdo (site público)
- `.write: "auth != null"` → Só quem está autenticado (anônimo via `storage.js`) pode escrever

---

## 5. Obter Credenciais do Projeto

1. No Firebase Console: **⚙️ Configurações do projeto** (ícone de engrenagem)
2. Aba **"Geral"**
3. Role até **"Seus apps"** → Ícone Web (`</>`)
4. Registre o app (nome: `Site-UniRio`, **não** marque Firebase Hosting)
5. Copie as **7 credenciais** do objeto `firebaseConfig`:

| Variável GitHub | Valor no Firebase |
|-----------------|-------------------|
| `FIREBASE_API_KEY` | `apiKey` |
| `FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `FIREBASE_DATABASE_URL` | `databaseURL` (copiado no passo 2) |
| `FIREBASE_PROJECT_ID` | `projectId` |
| `FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `FIREBASE_APP_ID` | `appId` |

---

## 6. Configurar GitHub Repository Variables

1. No seu repositório GitHub: **Settings → Secrets and variables → Actions**
2. Aba **"Variables"** → **"New repository variable"**
3. Crie as 7 variáveis acima (**exatamente** esses nomes)
4. Cole os valores correspondentes do Firebase

> **Não use Secrets** — use **Variables** (não são sensíveis, são chaves públicas do Firebase Web SDK)

---

## 7. Configurar GitHub Pages

1. No repositório: **Settings → Pages**
2. **Source**: "GitHub Actions"
3. Salve

---

## 8. Testar Localmente (Opcional)

Para desenvolver localmente sem afetar o Firebase de produção:

1. Crie `js/firebase-config.js` local com suas credenciais de um **projeto Firebase separado** (ou use o mesmo)
2. Adicione ao `.gitignore` (já feito)
3. Rode um servidor local:
```bash
npx serve .
# ou
python -m http.server 8000
```
4. Acesse `http://localhost:8000/admin-panel.html`
5. Faça login: `admin` / `unirio2026`
6. Edite algo → verifique no Firebase Console → Data se apareceu

---

## 9. Deploy

```bash
git add .
git commit -m "feat: migrate to Firebase RTDB with real-time sync"
git push origin main
```

O GitHub Actions vai:
1. Gerar `js/firebase-config.js` com as variables
2. Fazer deploy no GitHub Pages
3. O site ficará disponível em `https://SEU-USUARIO.github.io/Site-UniRio/`

---

## 10. Verificação Pós-Deploy

| Teste | Como Verificar |
|-------|----------------|
| Admin carrega | Acesse `/admin-panel.html`, login funciona |
| Salvar conteúdo | Edite "Hero" → aparece no Firebase Console → Data |
| Sync tempo real | Abra `/index.html` em aba anônima → edite no admin → muda sem reload |
| Reset | Botão "Resetar Conteúdo" → limpa no Firebase |
| Rules bloqueiam | `curl -X PUT -d '{}' https://SEU-PROJETO-default-rtdb.firebaseio.com/votoConscienteContent.json` → deve dar `401 Unauthorized` |

---

## Estrutura de Dados no Firebase

```
votoConscienteContent/
├── hero: "Título\nSubtítulo com <br> quebras"
├── apresentacao: "Texto da apresentação..."
├── objetivos: "Objetivo 1\nObjetivo 2\nObjetivo 3"
├── equipe: "Ana Silva - Coordenadora\nJoão Santos - Desenvolvedor"
├── eventos: "Oficina - 15/04/2026 - UNIRIO\nPalestra - 20/05/2026 - Auditório"
├── noticias: "Lançamento - 01/03/2026 - Descrição da notícia"
├── cards: "Eleições - Entenda - eleicoes-2026.html\nQuiz - Teste - quiz.html"
├── footer: "Contato: votoconsciente@unirio.br"
└── candidatos: "Candidato A - PT - 13\nCandidato B - PL - 22"
```

---

## Troubleshooting

### "Firebase: Error (auth/internal-error)"
- Verifique se **Authentication → Anônimo** está **Ativado**
- Aguarde 1-2 min após ativar

### "Permission denied" ao salvar
- Confira as **Regras** do Realtime Database
- Deve ser exatamente: `".write": "auth != null"`

### Conteúdo não atualiza no site
- Abra DevTools → Console → procure erros de CORS ou network
- Verifique se `FIREBASE_DATABASE_URL` está correta (inclui `https://`)

### GitHub Actions falha "Variable not found"
- Confira se as 7 variáveis estão em **Settings → Variables** (não Secrets)
- Nomes exatos: `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, etc.

### Site mostra conteúdo antigo
- Hard refresh: `Ctrl+Shift+R` (limpa cache do service worker se houver)
- Verifique se o deploy no Actions passou (badge verde)

---

## Fluxo de Trabalho da Equipe

1. **Admin** acessa `/admin-panel.html` → login `admin` / `unirio2026`
2. Clica na seção → edita → **"Salvar"**
3. **Imediatamente** todos os visitantes veem a mudança (real-time via `onContentChange`)
4. Para resetar: botão **"Resetar Conteúdo"** → confirmação dupla

---

## Arquivos Principais

| Arquivo | Função |
|---------|--------|
| `js/storage.js` | Wrapper Firebase (get/save/reset/onChange) |
| `js/firebase-config.js` | Gerado no CI com credenciais |
| `admin-panel.html` | Painel admin (usa `storage.js`) |
| `js/script.js` | Site principal (usa `storage.js` + `onContentChange`) |
| `.github/workflows/deploy.yml` | CI/CD GitHub Pages |
| `.gitignore` | Ignora `js/firebase-config.js` |

---

## Atualizar Credenciais Futuramente

Se precisar trocar chaves (ex: projeto Firebase novo):
1. Atualize as 7 **Repository Variables** no GitHub
2. Faça um push vazio ou re-run o workflow:
```bash
git commit --allow-empty -m "chore: refresh firebase config"
git push origin main
```