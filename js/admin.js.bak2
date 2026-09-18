// ============================================
// ADMIN INLINE EDITING - VERSÃO SIMPLIFICADA
// (usa localStorage direto, sem módulos ES)
// ============================================

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

// ===== STORAGE (compatível com script normal) =====
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
  } catch (e) {
    console.error('Erro ao salvar:', e);
  }
}

// ===== AUTENTICAÇÃO =====
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
  } catch (e) {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
}

// ===== LIMPAR FEATURES ANTERIORES =====
function removeAllAdminFeatures() {
  const adminStyles = document.getElementById('admin-inline-styles');
  if (adminStyles) adminStyles.remove();

  const topBadge = document.querySelector('.admin-badge-top');
  if (topBadge) topBadge.remove();

  const toolbar = document.getElementById('admin-toolbar');
  if (toolbar) toolbar.remove();

  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.removeAttribute('contenteditable');
    el.classList.remove('admin-editable');
    el.querySelectorAll('.admin-edit-badge').forEach(b => b.remove());
  });

  document.querySelectorAll('.admin-editable').forEach(el => {
    el.style.outline = 'none';
    el.classList.remove('admin-editable');
  });

  window.isEditing = false;
  window.toolbar = null;
}

// ===== ESTILOS DO ADMIN =====
function injectAdminStyles() {
  if (document.getElementById('admin-inline-styles')) return;

  const style = document.createElement('style');
  style.id = 'admin-inline-styles';
  style.textContent = `
    .admin-editable {
      outline: 2px dashed transparent;
      transition: outline 0.2s;
      position: relative;
    }
    .admin-editable:hover { outline-color: #cf6357; }
    .admin-editable:focus { outline-color: #cf6357; background: #fffef8; }

    .admin-edit-badge {
      position: absolute; top: -8px; right: -8px;
      background: #cf6357; color: #faf5e8;
      font-size: 0.65rem; padding: 2px 6px;
      border-radius: 4px; font-weight: 700;
      opacity: 0; transition: opacity 0.2s;
      pointer-events: none; white-space: nowrap;
    }
    .admin-editable:hover .admin-edit-badge { opacity: 1; }

    .admin-badge-top {
      position: fixed; top: 1rem; right: 1rem; z-index: 10000;
      background: #cf6357; color: #faf5e8;
      padding: 0.5rem 1rem; border-radius: 2rem;
      font-weight: 600; font-size: 0.85rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      font-family: 'Segoe UI', sans-serif;
    }
    .admin-badge-top button {
      background: none; border: none; color: inherit;
      text-decoration: underline; cursor: pointer;
      font-weight: 700; font-size: 0.85rem;
    }

    .admin-toolbar {
      position: fixed; bottom: 1rem; left: 50%;
      transform: translateX(-50%);
      background: #2c1e1f; color: #faf5e8;
      padding: 0.8rem 1.5rem; border-radius: 2rem;
      display: flex; gap: 0.5rem; z-index: 1000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    .admin-toolbar button {
      background: #cf6357; color: #faf5e8;
      border: none; padding: 0.4rem 1rem;
      border-radius: 2rem; font-weight: 600;
      cursor: pointer; font-size: 0.85rem;
    }
    .admin-toolbar button:hover { background: #74402d; }
    .admin-toolbar button.secondary { background: #95a5a6; }
  `;
  document.head.appendChild(style);
}

// ===== TORNAR ELEMENTO EDITÁVEL =====
function makeEditable(selector, storageKey, options = {}) {
  const elements = document.querySelectorAll(selector);
  if (elements.length === 0) return;

  const savedContent = getSavedContent();

  elements.forEach((el) => {
    // Aplicar conteúdo salvo, se existir
    if (savedContent[storageKey] !== undefined) {
      if (options.isHtml) {
        el.innerHTML = savedContent[storageKey];
      } else {
        el.textContent = savedContent[storageKey];
      }
    }

    el.classList.add('admin-editable');
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-storage-key', storageKey);

    // Badge
    const badge = document.createElement('span');
    badge.className = 'admin-edit-badge';
    badge.textContent = options.badge || '✏️ Editar';
    el.appendChild(badge);

    // Salvar ao sair
    el.addEventListener('blur', () => {
      const value = options.isHtml ? el.innerHTML : el.textContent.trim();
      saveContent(storageKey, value);
      showNotification('✅ Salvo!');
    });

    // Enter salva (a menos que allowEnter)
    if (!options.allowEnter) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          el.blur();
        }
      });
    }
  });
}

// ===== NOTIFICAÇÃO =====
function showNotification(msg) {
  const existing = document.querySelector('.admin-notification');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.className = 'admin-notification';
  notif.textContent = msg;
  notif.style.cssText = `
    position: fixed; top: 2rem; right: 2rem;
    background: #27ae60; color: #fff;
    padding: 1rem 1.5rem; border-radius: 0.8rem;
    font-weight: 600; z-index: 10001;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    font-family: 'Segoe UI', sans-serif;
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2000);
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  removeAllAdminFeatures();

  if (!isAdminLoggedIn()) {
    console.log('🔒 Não-admin — sem edição');
    return;
  }

  console.log('👑 Admin detectado — ativando edição inline');
  injectAdminStyles();

  // Badge
  const badge = document.createElement('div');
  badge.className = 'admin-badge-top';
  badge.innerHTML = `👑 Admin | <button onclick="window.location.href='admin-panel.html'">Painel</button>`;
  document.body.appendChild(badge);

  // Tornar editáveis
  makeEditable('.hero__title', 'hero_title', { badge: 'Título Hero' });
  makeEditable('.hero__subtitle', 'hero_subtitle', { badge: 'Subtítulo Hero', allowEnter: true });
  makeEditable('.section-title', 'section_title', { badge: 'Título Seção' });

  // Cards genéricos
  document.querySelectorAll('.card h3').forEach((el, i) => {
    makeEditable(`.card:nth-child(${i+1}) h3`, `card_${i}_title`, { badge: 'Título Card' });
  });

  console.log('✅ Edição inline pronta');
});
