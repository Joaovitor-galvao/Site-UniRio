// ============================================
// ADMIN INLINE EDITING - VERSÃO UNIVERSAL
// Torna TUDO editável, salva em localStorage + Firebase
// ============================================

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

// ============ STORAGE ============
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
    console.log('💾 Salvo local:', key);
  } catch (e) { console.error('Erro localStorage:', e); }

  // Firebase (se disponível)
  if (window.firebaseConfig) {
    try {
      import('./storage.js').then(function(storage) {
        if (storage.saveContent) {
          storage.saveContent(key, value).then(function() {
            console.log('🔥 Firebase:', key);
          });
        }
      });
    } catch (e) { console.warn('Firebase não disponível:', e); }
  }
}

// ============ AUTH ============
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

// ============ NOTIFICAÇÃO ============
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

// ============ GERAR CHAVE ÚNICA PARA CADA ELEMENTO ============
// Baseado no caminho no DOM + texto original (para ser estável)
function gerarChave(el) {
  // 1. Se tem data-key, usa
  if (el.dataset.key) return el.dataset.key;

  // 2. Gera do caminho no DOM
  const path = [];
  let node = el;
  while (node && node !== document.body) {
    let selector = node.tagName.toLowerCase();
    if (node.id) {
      selector += '#' + node.id;
      path.unshift(selector);
      break;
    }
    if (node.className && typeof node.className === 'string') {
      const cls = node.className.split(' ').filter(function(c) {
        return c && !c.startsWith('admin-');
      })[0];
      if (cls) selector += '.' + cls;
    }
    // Adiciona índice entre irmãos do mesmo tipo
    const parent = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(function(s) {
        return s.tagName === node.tagName;
      });
      if (siblings.length > 1) {
        selector += ':nth-child(' + (siblings.indexOf(node) + 1) + ')';
      }
    }
    path.unshift(selector);
    node = node.parentElement;
  }

  const chave = 'auto_' + path.join('_').replace(/[^a-zA-Z0-9_:.-]/g, '_');
  return chave;
}

// ============ TORNAR ELEMENTO EDITÁVEL ============
function tornarEditavel(el, options) {
  options = options || {};

  // Pular se já é editável
  if (el.classList.contains('admin-editable')) return 0;
  if (el.classList.contains('admin-edit-badge')) return 0;
  if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return 0;
  if (el.tagName === 'HTML' || el.tagName === 'BODY' || el.tagName === 'HEAD') return 0;
  if (el.tagName === 'HEADER' || el.tagName === 'FOOTER' || el.tagName === 'NAV') return 0;

  // Pular containers grandes (não queremos editar o card inteiro, só o texto dentro)
  if (['DIV', 'SECTION', 'ARTICLE', 'ASIDE', 'MAIN'].includes(el.tagName)) {
    // Se o container só tem outros containers, pula (deixa os filhos serem editados)
    const filhosTexto = Array.from(el.children).filter(function(c) {
      return ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'A', 'STRONG', 'EM', 'TIME', 'LABEL', 'BUTTON'].includes(c.tagName);
    });
    if (filhosTexto.length === 0 && el.textContent.trim().length === 0) return 0;
    // Se é container com texto direto, pode ser editável
    const temTextoDireto = Array.from(el.childNodes).some(function(n) {
      return n.nodeType === 3 && n.textContent.trim().length > 3;
    });
    if (!temTextoDireto) return 0;
  }

  // Pular elementos vazios
  if (el.textContent.trim().length === 0 && el.tagName !== 'IMG') return 0;

  // Pular elementos muito pequenos (provavelmente ícones)
  if (el.textContent.trim().length < 3 && el.tagName !== 'IMG') return 0;

  const chave = gerarChave(el);
  el.dataset.key = chave;

  // ===== IMAGEM =====
  if (el.tagName === 'IMG') {
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
    overlay.innerHTML = '<span style="font-size:1.5rem;">🖼️</span><span style="font-size:0.75rem;font-weight:600;">Clique para trocar imagem</span>';
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

  // Badge
  if (!el.querySelector('.admin-edit-badge')) {
    const badge = document.createElement('span');
    badge.className = 'admin-edit-badge';
    badge.setAttribute('contenteditable', 'false');
    badge.textContent = options.badge || ('✏️ ' + el.tagName);
    el.appendChild(badge);
  }

  // Salvar ao sair
  el.addEventListener('blur', function() {
    const value = options.isHtml ? el.innerHTML.replace(/<span class="admin-edit-badge".*?<\/span>/g, '') : el.textContent.trim();
    saveContent(chave, value);
    showNotification('✅ Salvo!', 'success');
  });

  // Enter salva
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && !options.allowEnter) {
      e.preventDefault();
      el.blur();
    }
    if (e.key === 'Escape') {
      el.blur();
    }
  });

  return 1;
}

// ============ VARRER E MARCAR TUDO ============
function marcarTudoEditavel() {
  let total = 0;

  // Seletores de elementos que devem ser editáveis
  const SELETORES = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'li', 'span:not(.admin-edit-badge):not(.admin-badge-top):not(.admin-notification)',
    'a', 'strong', 'em', 'blockquote', 'cite',
    'time', 'label', 'button:not(.admin-edit-badge)',
    'img'
  ];

  SELETORES.forEach(function(sel) {
    document.querySelectorAll(sel).forEach(function(el) {
      // Pular se está dentro do admin badge, header, nav, footer admin
      if (el.closest('.admin-badge-top')) return;
      if (el.closest('.admin-notification')) return;
      if (el.closest('.admin-img-overlay')) return;
      if (el.classList.contains('admin-edit-badge')) return;

      // Pular menus (nav) para não editar
      if (el.closest('nav.main-nav')) return;
      if (el.closest('.main-header')) return;
      if (el.closest('.top-bar')) return;

      total += tornarEditavel(el, { badge: '✏️ ' + el.tagName });
    });
  });

  return total;
}

// ============ INICIALIZAÇÃO ============
document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 admin.js carregado');

  if (!isAdminLoggedIn()) {
    console.log('🔒 Não-admin — modo leitura');
    return;
  }

  console.log('👑 Admin detectado — ativando edição inline universal');

  // ===== CSS =====
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
    'img.admin-editable,',
    '.admin-img-wrapper img {',
    '  cursor: pointer;',
    '}',
    'a.admin-editable:hover {',
    '  background: rgba(207, 99, 87, 0.12);',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // ===== BADGE ADMIN =====
  const badge = document.createElement('div');
  badge.className = 'admin-badge-top';
  badge.innerHTML = '👑 Admin | <a href="admin-panel.html">Painel</a>';
  document.body.appendChild(badge);

  // ===== MARCAR TUDO =====
  // Pequeno delay para garantir que todo o DOM carregou
  setTimeout(function() {
    const total = marcarTudoEditavel();
    console.log('✅ Edição inline universal pronta — ' + total + ' elementos editáveis');
    console.log('💡 Passe o mouse sobre qualquer texto/imagem para editar');
  }, 500);

  // ===== OBSERVAR MUDANÇAS DINÂMICAS =====
  // (para pegar elementos adicionados depois, como slides de carrossel)
  const observer = new MutationObserver(function(mutations) {
    let novos = 0;
    mutations.forEach(function(m) {
      m.addedNodes.forEach(function(node) {
        if (node.nodeType === 1) {
          ['h1','h2','h3','h4','p','li','span','a','strong','em','time','img'].forEach(function(sel) {
            if (node.matches && node.matches(sel)) {
              novos += tornarEditavel(node, { badge: '✏️ ' + node.tagName });
            }
            if (node.querySelectorAll) {
              node.querySelectorAll(sel).forEach(function(el) {
                novos += tornarEditavel(el, { badge: '✏️ ' + el.tagName });
              });
            }
          });
        }
      });
    });
    if (novos > 0) console.log('🔄 ' + novos + ' novos elementos editáveis detectados');
  });

  setTimeout(function() {
    observer.observe(document.body, { childList: true, subtree: true });
  }, 1000);
});
