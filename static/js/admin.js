// ============================================
// ADMIN INLINE EDITING - Versão Protegida
// Bloqueia: botões, links, menus, formulários, ícones
// Permite:  textos de conteúdo, imagens de conteúdo
// ============================================

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

// ============================================
// TAGS E SELETORES PROTEGIDOS (NUNCA editáveis)
// ============================================

const TAGS_PROTEGIDAS = [
  'SCRIPT', 'STYLE', 'HTML', 'BODY', 'HEAD', 'META', 'LINK',
  'SVG', 'PATH', 'CIRCLE', 'RECT', 'LINE', 'POLYGON', 'POLYLINE', 'G', 'USE',
  'INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'FORM',
  'IFRAME', 'VIDEO', 'AUDIO', 'CANVAS', 'EMBED', 'OBJECT',
  'BR', 'HR', 'WBR'
];

const SELETORES_PROTEGIDOS = [
  // ===== NAVEGAÇÃO (menus e links) =====
  'nav', '[role="navigation"]', '.main-nav', '.nav-list', '.nav-item',
  '.dropdown', '.has-dropdown', '.menu-toggle',
  '.header', '.main-header', '.top-bar', '.header-search', '.header-social',
  '.logo', '.logo__imagem', '.logo__text',
  '.skip-link',

  // ===== LINKS DE NAVEGAÇÃO =====
  'a[href]:not(.content-link)',   // qualquer link é protegido (exceto os marcados como conteúdo)
  '.breadcrumb', '.pagination',

  // ===== BOTÕES DE AÇÃO =====
  'button', '.btn', '.access-btn',
  '[role="button"]', '[type="button"]', '[type="submit"]',
  '.btn-vermelho', '.btn-verde', '.btn-primary', '.btn-secondary',
  '.btn-back', '.btn-save', '.btn-reset', '.btn-download',
  '.btn-enviar', '.btn-login', '.btn-prev', '.btn-next',
  '.btn-voltar-sim', '.btn-voltar-flash', '.btn-voltar-jogo',
  '.logout-btn', '.admin-card',
  '[onclick]', '[onmousedown]', '[onmouseup]', '[onchange]',

  // ===== CARROSSÉIS E SLIDERS =====
  '.equipe-seta', '.destaques-seta', '.equipe-bolha', '.destaques-bolha',
  '.quiz-progress', '.progresso', '.dot',

  // ===== FORMULÁRIOS =====
  '.form-group', '.form-card', '.contact-form', '.contato-grid',
  '.sugestao-box', '.info-card',
  'input', 'textarea', 'select', 'label[for]',

  // ===== INTERATIVOS =====
  '.quiz-container', '.question-card', '.result-container',
  '.flash-card', '.flash-grid', '.flash-container',
  '.jogo-container', '.cenario-card',
  '.sim-container', '.prioridade-item', '.prioridade-grid',
  '.start-screen', '.resultado-container',

  // ===== ADMIN =====
  '.admin-badge-top', '.admin-notification', '.admin-edit-badge',
  '.admin-img-wrapper', '.admin-img-overlay', '.admin-toolbar',
  '.admin-stats', '.admin-stat', '.admin-user',
  '.edit-area', '#edit-area', '#preview-box',
  '#export-status', '.status',

  // ===== ÍCONES E EMOJIS DECORATIVOS =====
  '.card__icon', '.card-icon', '.icone', '.emoji', '.cargo-icon',
  '.perfil-foto', '.foto-candidato', '.foto-grande',

  // ===== ESTRUTURAIS =====
  'header', 'footer', '.footer__bottom', '.footer__col h4',
  '[aria-hidden="true"]', '[aria-label]', '[title]',
  '.sr-only', '.visually-hidden',

  // ===== BADGES E TAGS =====
  '.badge', '.numero-partido', '.cargo-tag', '.card--team__badge',
  '.search-result-item', '.search-results',

  // ===== COMPONENTES ESPECÍFICOS =====
  '.equipe-slider', '.destaques-slider', '.destaques-track',
  '.destaques-viewport', '.destaques-seta', '.equipe-seta',
  '.prioridades-escolhidas .tag',

  // ===== PÁGINAS DE CANDIDATOS =====
  '.candidato-card', '.candidato-hero .numero-partido',
  '.botoes-container',

  // ===== CARD DE CANDIDATO (link) =====
  '.card[onclick]',
  '.card--link'
];

// ============================================
// FUNÇÃO: Esta protegido?
// ============================================
function estaProtegido(el) {
  if (!el || el.nodeType !== 1) return true;

  // 1. Tag proibida
  if (TAGS_PROTEGIDAS.includes(el.tagName)) return true;

  // 2. Seletor protegido (próprio ou ancestral)
  for (let i = 0; i < SELETORES_PROTEGIDOS.length; i++) {
    try {
      if (el.matches && el.matches(SELETORES_PROTEGIDOS[i])) return true;
      if (el.closest && el.closest(SELETORES_PROTEGIDOS[i])) return true;
    } catch (e) { /* seletor inválido */ }
  }

  // 3. Elemento com onclick inline
  if (el.hasAttribute('onclick')) return true;

  // 4. Elemento com contenteditable=false
  if (el.getAttribute('contenteditable') === 'false') return true;

  return false;
}

// ============================================
// STORAGE
// ============================================
function getSavedContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveContent(key, value) {
  const current = getSavedContent();
  current[key] = value;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    console.log('💾 Salvo:', key);
  } catch (e) { console.error('Erro:', e); }
}

// ============================================
// AUTH
// ============================================
function isAdminLoggedIn() {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  try {
    const data = JSON.parse(session);
    if (typeof data !== 'object' || data === null) return false;
    if (data.username !== 'admin') return false;
    if (typeof data.expires !== 'number') return false;
    if (data.expires < Date.now()) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
}

// ============================================
// NOTIFICAÇÃO
// ============================================
function showNotification(msg, type) {
  const existing = document.querySelector('.admin-notification');
  if (existing) existing.remove();
  const colors = { success: '#27ae60', error: '#e74c3c', info: '#3498db' };
  const notif = document.createElement('div');
  notif.className = 'admin-notification';
  notif.textContent = msg;
  notif.style.cssText = 'position:fixed;top:2rem;right:2rem;background:' + (colors[type] || colors.success) + ';color:#fff;padding:1rem 1.5rem;border-radius:0.8rem;font-weight:600;z-index:10001;box-shadow:0 4px 20px rgba(0,0,0,0.2);font-family:Segoe UI,sans-serif;';
  document.body.appendChild(notif);
  setTimeout(function() { notif.remove(); }, 2000);
}

// ============================================
// GERAR CHAVE ÚNICA
// ============================================
function gerarChave(el) {
  if (el.dataset.key) return el.dataset.key;
  if (el.id) return 'id_' + el.id;

  const path = [];
  let node = el;
  while (node && node !== document.body) {
    let sel = node.tagName.toLowerCase();
    if (node.id) {
      sel += '#' + node.id;
      path.unshift(sel);
      break;
    }
    if (node.className && typeof node.className === 'string') {
      const cls = node.className.split(' ').filter(function(c) {
        return c && !c.startsWith('admin-');
      })[0];
      if (cls) sel += '.' + cls;
    }
    const parent = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(function(s) {
        return s.tagName === node.tagName;
      });
      if (siblings.length > 1) {
        sel += ':nth-child(' + (siblings.indexOf(node) + 1) + ')';
      }
    }
    path.unshift(sel);
    node = node.parentElement;
  }

  return 'auto_' + path.join('_').replace(/[^a-zA-Z0-9_:.-]/g, '_');
}

// ============================================
// TORNAR ELEMENTO EDITÁVEL
// ============================================
function tornarEditavel(el, options) {
  options = options || {};

  // Já editável? Pula
  if (el.classList.contains('admin-editable')) return 0;

  // PROTEGIDO? Pula
  if (estaProtegido(el)) return 0;

  // Vazio? Pula
  if (el.textContent.trim().length === 0 && el.tagName !== 'IMG') return 0;
  if (el.textContent.trim().length < 3 && el.tagName !== 'IMG') return 0;

  const chave = gerarChave(el);
  el.dataset.key = chave;

  // ===== IMAGEM =====
  if (el.tagName === 'IMG') {
    // Imagens de logo/ícones já estão na lista de proteção
    const savedContent = getSavedContent();
    if (savedContent[chave]) el.src = savedContent[chave];

    const wrapper = document.createElement('div');
    wrapper.className = 'admin-img-wrapper';
    wrapper.style.cssText = 'position:relative;display:inline-block;';
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);

    const overlay = document.createElement('div');
    overlay.className = 'admin-img-overlay';
    overlay.style.cssText = 'position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(44,30,31,0.85);color:#faf5e8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.5rem;opacity:0;transition:opacity 0.2s;cursor:pointer;border-radius:inherit;padding:1rem;text-align:center;';
    overlay.innerHTML = '<span style="font-size:1.5rem;">🖼️</span><span style="font-size:0.75rem;font-weight:600;">Clique para trocar</span>';
    wrapper.appendChild(overlay);

    wrapper.addEventListener('mouseenter', function() { overlay.style.opacity = '1'; });
    wrapper.addEventListener('mouseleave', function() { overlay.style.opacity = '0'; });
    overlay.addEventListener('click', function(e) {
      e.stopPropagation();
      const novaUrl = prompt('Nova URL da imagem:', el.src);
      if (novaUrl && novaUrl.trim()) {
        el.src = novaUrl.trim();
        saveContent(chave, novaUrl.trim());
        showNotification('✅ Imagem atualizada!', 'success');
      }
    });

    return 1;
  }

  // ===== TEXTO =====
  const savedContent = getSavedContent();
  if (savedContent[chave] !== undefined) {
    if (options.isHtml) {
      el.innerHTML = savedContent[chave];
    } else {
      el.textContent = savedContent[chave];
    }
  }

  el.classList.add('admin-editable');
  el.setAttribute('contenteditable', 'true');
  el.setAttribute('spellcheck', 'false');
  if (!el.style.position || el.style.position === 'static') {
    el.style.position = 'relative';
  }

  if (!el.querySelector('.admin-edit-badge')) {
    const badge = document.createElement('span');
    badge.className = 'admin-edit-badge';
    badge.setAttribute('contenteditable', 'false');
    badge.textContent = '✏️';
    el.appendChild(badge);
  }

  el.addEventListener('blur', function() {
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.admin-edit-badge').forEach(function(b) { b.remove(); });
    const value = options.isHtml ? clone.innerHTML : clone.textContent.trim();
    saveContent(chave, value);
    showNotification('✅ Salvo!', 'success');
  });

  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && !options.allowEnter) {
      e.preventDefault();
      el.blur();
    }
    if (e.key === 'Escape') el.blur();
  });

  return 1;
}

// ============================================
// MARCAR ELEMENTOS EDITÁVEIS
// ============================================
function marcarTudoEditavel() {
  let total = 0;

  // Seletores PERMITIDOS (textos de conteúdo)
  const SELETORES_PERMITIDOS = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'li', 'blockquote', 'cite',
    'td', 'th', 'caption',
    'time'
  ];

  SELETORES_PERMITIDOS.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) {
      total += tornarEditavel(el, { badge: '✏️ ' + el.tagName });
    });
  });

  // Imagens de CONTEÚDO (as de logo/ícone já estão protegidas)
  document.querySelectorAll('img').forEach(function(el) {
    total += tornarEditavel(el, {});
  });

  // Spans e strongs APENAS se forem "conteúdo puro" (sem onclick, sem link)
  document.querySelectorAll('span:not([onclick]), strong:not([onclick]), em:not([onclick])').forEach(function(el) {
    // Só edita se o pai não for um link ou botão
    if (el.closest('a, button, [onclick]')) return;
    // Só edita se tiver texto significativo
    if (el.textContent.trim().length < 3) return;
    total += tornarEditavel(el, { badge: '✏️' });
  });

  return total;
}

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 admin.js carregado');

  if (!isAdminLoggedIn()) {
    console.log('🔒 Não-admin — modo leitura');
    return;
  }

  console.log('👑 Admin detectado — ativando edição inline protegida');

  const style = document.createElement('style');
  style.id = 'admin-inline-styles';
  style.textContent = [
    '.admin-editable {',
    '  outline: 2px dashed transparent;',
    '  transition: outline 0.15s, background 0.15s;',
    '  position: relative;',
    '  min-height: 1em;',
    '  cursor: text;',
    '  border-radius: 4px;',
    '}',
    '.admin-editable:hover {',
    '  outline-color: #cf6357;',
    '  background: rgba(207, 99, 87, 0.08);',
    '}',
    '.admin-editable:focus {',
    '  outline-color: #cf6357;',
    '  background: rgba(255, 254, 248, 0.95);',
    '  outline-style: solid;',
    '}',
    '.admin-edit-badge {',
    '  position: absolute;',
    '  top: -10px;',
    '  right: -8px;',
    '  background: #cf6357;',
    '  color: #faf5e8;',
    '  font-size: 0.6rem;',
    '  padding: 2px 6px;',
    '  border-radius: 4px;',
    '  font-weight: 700;',
    '  opacity: 0;',
    '  transition: opacity 0.2s;',
    '  pointer-events: none;',
    '  white-space: nowrap;',
    '  z-index: 100;',
    '  font-family: Segoe UI, sans-serif;',
    '}',
    '.admin-editable:hover .admin-edit-badge,',
    '.admin-editable:focus .admin-edit-badge {',
    '  opacity: 1;',
    '}',
    '.admin-badge-top {',
    '  position: fixed;',
    '  top: 1rem;',
    '  right: 1rem;',
    '  z-index: 10000;',
    '  background: #cf6357;',
    '  color: #faf5e8;',
    '  padding: 0.5rem 1rem;',
    '  border-radius: 2rem;',
    '  font-weight: 600;',
    '  font-size: 0.85rem;',
    '  box-shadow: 0 2px 10px rgba(0,0,0,0.2);',
    '  font-family: Segoe UI, sans-serif;',
    '}',
    '.admin-badge-top a {',
    '  color: #faf5e8;',
    '  text-decoration: underline;',
    '}',
    '.admin-img-wrapper img {',
    '  cursor: pointer;',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  const badge = document.createElement('div');
  badge.className = 'admin-badge-top';
  badge.innerHTML = '👑 Admin | <a href="admin-panel.html">Painel</a>';
  document.body.appendChild(badge);

  setTimeout(function() {
    const total = marcarTudoEditavel();
    console.log('✅ Edição inline PRONTA — ' + total + ' elementos editáveis');
    console.log('🔒 Botões, links, menus e formulários PROTEGIDOS');
  }, 500);

  // Observar elementos adicionados depois
  const observer = new MutationObserver(function(mutations) {
    let novos = 0;
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType !== 1) return;
        if (estaProtegido(node)) return;

        ['h1','h2','h3','h4','p','li','blockquote','time'].forEach(function(sel) {
          if (node.matches && node.matches(sel)) {
            novos += tornarEditavel(node, { badge: '✏️' });
          }
          if (node.querySelectorAll) {
            node.querySelectorAll(sel).forEach(function(el) {
              novos += tornarEditavel(el, { badge: '✏️' });
            });
          }
        });
      });
    });
    if (novos > 0) console.log('🔄 ' + novos + ' novos elementos detectados');
  });

  setTimeout(function() {
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1000);
});
