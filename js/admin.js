// ============================================
// ADMIN INLINE EDITING - Versão Expandida
// ============================================

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

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
  } catch (e) { console.error(e); }
}

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

function showNotification(msg, type) {
  const existing = document.querySelector('.admin-notification');
  if (existing) existing.remove();
  const colors = { success: '#27ae60', error: '#e74c3c', info: '#3498db' };
  const notif = document.createElement('div');
  notif.className = 'admin-notification';
  notif.textContent = msg;
  notif.style.cssText = `position:fixed;top:2rem;right:2rem;background:${colors[type]||colors.success};color:#fff;padding:1rem 1.5rem;border-radius:0.8rem;font-weight:600;z-index:10001;box-shadow:0 4px 20px rgba(0,0,0,0.2);font-family:Segoe UI,sans-serif;`;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

// ===== Torna elemento editável =====
function makeEditable(selector, storageKey, options) {
  options = options || {};
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return 0;

  const savedContent = getSavedContent();
  let count = 0;

  elements.forEach(function(el, index) {
    const key = options.multiple ? storageKey + '_' + index : storageKey;

    if (savedContent[key] !== undefined) {
      if (options.isHtml) {
        el.innerHTML = savedContent[key];
      } else {
        el.textContent = savedContent[key];
      }
    }

    el.classList.add('admin-editable');
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-key', key);
    el.style.minHeight = '1em';

    const badge = document.createElement('span');
    badge.className = 'admin-edit-badge';
    badge.textContent = options.badge || '✏️ Editar';
    el.style.position = 'relative';
    el.appendChild(badge);

    el.addEventListener('blur', function() {
      const value = options.isHtml ? el.innerHTML : el.textContent.trim();
      saveContent(key, value);
      showNotification('✅ Salvo!', 'success');
    });

    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey && !options.allowEnter) {
        e.preventDefault();
        el.blur();
      }
    });

    count++;
  });

  return count;
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('🔧 admin.js carregado');

  if (!isAdminLoggedIn()) {
    console.log('🔒 Não-admin — sem edição inline');
    return;
  }

  console.log('👑 Admin detectado — ativando edição inline');

  // ===== CSS =====
  const style = document.createElement('style');
  style.textContent = `
    .admin-editable {
      outline: 2px dashed transparent;
      transition: outline 0.2s;
      position: relative;
      min-height: 1em;
      cursor: text;
    }
    .admin-editable:hover { outline-color: #cf6357; background: rgba(207,99,87,0.05); }
    .admin-editable:focus { outline-color: #cf6357; background: #fffef8; }

    .admin-edit-badge {
      position: absolute; top: -10px; right: -8px;
      background: #cf6357; color: #faf5e8;
      font-size: 0.6rem; padding: 2px 6px;
      border-radius: 4px; font-weight: 700;
      opacity: 0; transition: opacity 0.2s;
      pointer-events: none; white-space: nowrap;
      z-index: 100;
    }
    .admin-editable:hover .admin-edit-badge { opacity: 1; }
    .admin-editable:focus .admin-edit-badge { opacity: 1; }

    .admin-badge-top {
      position: fixed; top: 1rem; right: 1rem; z-index: 10000;
      background: #cf6357; color: #faf5e8;
      padding: 0.5rem 1rem; border-radius: 2rem;
      font-weight: 600; font-size: 0.85rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', sans-serif;
    }
    .admin-badge-top a { color: #faf5e8; text-decoration: underline; }
  `;
  document.head.appendChild(style);

  const badge = document.createElement('div');
  badge.className = 'admin-badge-top';
  badge.innerHTML = '👑 Admin | <a href="admin-panel.html">Painel</a>';
  document.body.appendChild(badge);

  // ===== REGISTRAR TODOS OS CAMPOS EDITÁVEIS =====
  let total = 0;

  // HERO
  total += makeEditable('.hero__title', 'hero_title', { badge: 'Título Hero' });
  total += makeEditable('.hero__subtitle', 'hero_subtitle', { badge: 'Subtítulo Hero', allowEnter: true });

  // SEÇÃO APRESENTAÇÃO
  total += makeEditable('#apresentacao .section-title', 'apresentacao_titulo', { badge: 'Título Apresentação' });
  total += makeEditable('#apresentacao .grid-2 .card p', 'apresentacao_texto', { badge: 'Texto Apresentação', allowEnter: true, multiple: true });
  total += makeEditable('#apresentacao .card h3', 'apresentacao_card_titulo', { badge: 'Título Card', multiple: true });

  // OBJETIVOS (lista)
  total += makeEditable('#apresentacao .card ul', 'objetivos_lista', { isHtml: true, badge: 'Lista Objetivos' });

  // SEÇÃO IMPORTÂNCIA SOCIAL/ACADÊMICA
  document.querySelectorAll('.section--alt .card h3').forEach(function(el, i) {
    const key = 'impacto_' + i + '_titulo';
    const saved = getSavedContent()[key];
    if (saved) el.textContent = saved;
    el.classList.add('admin-editable');
    el.setAttribute('contenteditable', 'true');
    el.style.position = 'relative';
    const b = document.createElement('span');
    b.className = 'admin-edit-badge';
    b.textContent = '✏️ Título';
    el.appendChild(b);
    el.addEventListener('blur', function() {
      saveContent(key, el.textContent.trim());
      showNotification('✅ Salvo!', 'success');
    });
    total++;
  });

  document.querySelectorAll('.section--alt .card p').forEach(function(el, i) {
    const key = 'impacto_' + i + '_texto';
    const saved = getSavedContent()[key];
    if (saved) el.textContent = saved;
    el.classList.add('admin-editable');
    el.setAttribute('contenteditable', 'true');
    el.style.position = 'relative';
    const b = document.createElement('span');
    b.className = 'admin-edit-badge';
    b.textContent = '✏️ Texto';
    el.appendChild(b);
    el.addEventListener('blur', function() {
      saveContent(key, el.textContent.trim());
      showNotification('✅ Salvo!', 'success');
    });
    total++;
  });

  // DESTAQUES (cards do carrossel)
  document.querySelectorAll('.destaque-item').forEach(function(item, i) {
    const h3 = item.querySelector('h3');
    const p = item.querySelector('p');
    if (h3) {
      makeOne(h3, 'destaque_' + i + '_titulo', 'Título Destaque');
      total++;
    }
    if (p) {
      makeOne(p, 'destaque_' + i + '_texto', 'Texto Destaque');
      total++;
    }
  });

  // EQUIPE (slides)
  document.querySelectorAll('.equipe-slide').forEach(function(slide, i) {
    const h3 = slide.querySelector('h3');
    const ps = slide.querySelectorAll('p');
    if (h3) {
      makeOne(h3, 'equipe_' + i + '_titulo', 'Título Equipe');
      total++;
    }
    ps.forEach(function(p, pi) {
      makeOne(p, 'equipe_' + i + '_p' + pi, 'Nome Equipe');
      total++;
    });
  });

  // NOTÍCIAS
  document.querySelectorAll('.news-card').forEach(function(card, i) {
    const h3 = card.querySelector('h3');
    const p = card.querySelector('p');
    if (h3) {
      makeOne(h3, 'noticia_' + i + '_titulo', 'Título Notícia');
      total++;
    }
    if (p) {
      makeOne(p, 'noticia_' + i + '_texto', 'Texto Notícia');
      total++;
    }
  });

  // EVENTOS / PRÓXIMOS EVENTOS
  document.querySelectorAll('.section .card h3').forEach(function(h3, i) {
    if (h3.textContent.includes('Seminário') || h3.textContent.includes('Palestra')) {
      makeOne(h3, 'evento_' + i + '_titulo', 'Título Evento');
      total++;
    }
  });

  // SEÇÕES TÍTULOS (Apresentação, Destaques, Equipe, Notícias, Próximos Eventos)
  document.querySelectorAll('.section-title').forEach(function(el, i) {
    makeOne(el, 'section_title_' + i, 'Título Seção');
    total++;
  });

  // FOOTER
  document.querySelectorAll('.footer__col h3').forEach(function(el, i) {
    makeOne(el, 'footer_h3_' + i, 'Título Footer');
    total++;
  });
  document.querySelectorAll('.footer__col h4').forEach(function(el, i) {
    makeOne(el, 'footer_h4_' + i, 'Subtítulo Footer');
    total++;
  });
  document.querySelectorAll('.footer__col p').forEach(function(el, i) {
    makeOne(el, 'footer_p_' + i, 'Texto Footer');
    total++;
  });

  console.log('✅ Edição inline pronta — ' + total + ' campos editáveis');
});

// Helper: torna UM elemento editável
function makeOne(el, key, label) {
  const saved = getSavedContent()[key];
  if (saved !== undefined) el.textContent = saved;
  el.classList.add('admin-editable');
  el.setAttribute('contenteditable', 'true');
  el.style.position = 'relative';
  const badge = document.createElement('span');
  badge.className = 'admin-edit-badge';
  badge.textContent = '✏️ ' + label;
  el.appendChild(badge);
  el.addEventListener('blur', function() {
    saveContent(key, el.textContent.trim());
    showNotification('✅ Salvo!', 'success');
  });
  el.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      el.blur();
    }
  });
}
