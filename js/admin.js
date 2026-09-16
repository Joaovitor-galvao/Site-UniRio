// Admin Inline Editing - Permite editar conteúdo diretamente no site quando logado como admin

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

function isAdminLoggedIn() {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  try {
    const data = JSON.parse(session);
    return data.username === 'admin';
  } catch (e) {
    return false;
  }
}

function getSavedContent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveContent(key, value) {
  const content = getSavedContent();
  content[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

function showNotification(message, type = 'info') {
  document.querySelectorAll('.admin-inline-notification').forEach(el => el.remove());
  const colors = { success: '#27ae60', warning: '#f39c12', error: '#e74c3c', info: '#cf6357' };
  const notification = document.createElement('div');
  notification.className = 'admin-inline-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; bottom: 2rem; right: 2rem; padding: 1rem 1.5rem;
    border-radius: 0.8rem; color: white; font-weight: 600; z-index: 10000;
    background: ${colors[type] || colors.info}; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => { notification.style.animation = 'slideOut 0.3s ease'; setTimeout(() => notification.remove(), 300); }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(120%); opacity: 0; } }
  .admin-editable { outline: 2px dashed transparent; transition: outline 0.2s; position: relative; }
  .admin-editable:hover { outline-color: #cf6357; }
  .admin-editable:focus { outline-color: #cf6357; background: #fffef8; }
  .admin-edit-badge {
    position: absolute; top: -8px; right: -8px; background: #cf6357; color: #faf5e8;
    font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;
    opacity: 0; transition: opacity 0.2s; pointer-events: none; white-space: nowrap;
  }
  .admin-editable:hover .admin-edit-badge { opacity: 1; }
  .admin-toolbar {
    position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%);
    background: #2c1e1f; color: #faf5e8; padding: 0.8rem 1.5rem;
    border-radius: 2rem; display: flex; gap: 0.5rem; z-index: 1000;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: none;
  }
  .admin-toolbar.show { display: flex; }
  .admin-toolbar button {
    background: #cf6357; color: #faf5e8; border: none; padding: 0.4rem 1rem;
    border-radius: 2rem; font-weight: 600; cursor: pointer; font-size: 0.85rem;
    transition: background 0.2s;
  }
  .admin-toolbar button:hover { background: #74402d; }
  .admin-toolbar button.secondary { background: #95a5a6; }
  .admin-toolbar button.secondary:hover { background: #7f8c8d; }
  .admin-img-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(44, 30, 31, 0.7); color: #faf5e8;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 0.5rem; opacity: 0; transition: opacity 0.2s; pointer-events: none;
    border-radius: inherit;
  }
  .admin-img-container:hover .admin-img-overlay { opacity: 1; pointer-events: auto; }
  .admin-img-overlay input { max-width: 90%; padding: 0.3rem; border-radius: 4px; border: none; font-size: 0.85rem; }
`;
document.head.appendChild(style);

function makeEditable(selector, storageKey, options = {}) {
  const elements = document.querySelectorAll(selector);
  const savedContent = getSavedContent();
  
  elements.forEach((el, index) => {
    const key = options.multiple ? `${storageKey}_${index}` : storageKey;
    
    // Aplicar conteúdo salvo se existir
    if (savedContent[key]) {
      if (options.isImage) {
        el.src = savedContent[key];
      } else if (options.isHtml) {
        el.innerHTML = savedContent[key];
      } else {
        el.textContent = savedContent[key];
      }
    }
    
    if (options.isImage) {
      // Para imagens - criar wrapper com overlay
      const wrapper = document.createElement('div');
      wrapper.className = 'admin-img-container';
      wrapper.style.cssText = 'position: relative; display: inline-block;';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
      
      const overlay = document.createElement('div');
      overlay.className = 'admin-img-overlay';
      overlay.innerHTML = `
        <span style="font-size: 1.2rem;">🖼️</span>
        <input type="url" placeholder="Nova URL da imagem" value="${el.src}" 
               onkeydown="if(event.key==='Enter'){event.preventDefault();window.adminSaveImage('${key}', this.value)}"
               onblur="window.adminSaveImage('${key}', this.value)">
      `;
      wrapper.appendChild(overlay);
      
      window[`adminSaveImage_${key}`] = (url) => {
        if (url && url.trim()) {
          el.src = url.trim();
          saveContent(key, url.trim());
          showNotification('✅ Imagem atualizada!', 'success');
        }
      };
    } else {
      // Para texto
      el.classList.add('admin-editable');
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('data-storage-key', key);
      
      const badge = document.createElement('span');
      badge.className = 'admin-edit-badge';
      badge.textContent = options.badge || '✏️ Editar';
      el.appendChild(badge);
      
      // Salvar ao perder foco
      el.addEventListener('blur', () => {
        const value = options.isHtml ? el.innerHTML : el.textContent;
        saveContent(key, value);
        showNotification('✅ Texto salvo!', 'success');
      });
      
      // Enter para salvar (exceto em elementos que precisam de quebra de linha)
      if (!options.allowEnter) {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            el.blur();
          }
        });
      }
    }
  });
}

// Toolbar global
function createToolbar() {
  const toolbar = document.createElement('div');
  toolbar.className = 'admin-toolbar';
  toolbar.id = 'admin-toolbar';
  toolbar.innerHTML = `
    <button onclick="window.adminSaveAll()">💾 Salvar Tudo</button>
    <button class="secondary" onclick="window.adminReset()">🔄 Resetar</button>
    <button class="secondary" onclick="window.adminToggleEdit()">👁️ ${isEditing ? 'Desativar' : 'Ativar'} Edição</button>
  `;
  document.body.appendChild(toolbar);
  return toolbar;
}

let isEditing = false;
let toolbar = null;

function toggleEditMode() {
  isEditing = !isEditing;
  document.querySelectorAll('.admin-editable, .admin-img-container').forEach(el => {
    el.style.pointerEvents = isEditing ? 'auto' : 'none';
    if (el.classList.contains('admin-editable')) {
      el.setAttribute('contenteditable', isEditing);
    }
  });
  if (toolbar) {
    toolbar.classList.toggle('show', isEditing);
    toolbar.querySelector('button:last-child').textContent = `👁️ ${isEditing ? 'Desativar' : 'Ativar'} Edição`;
  }
  showNotification(isEditing ? '✏️ Modo edição ATIVADO' : '👁️ Modo edição DESATIVADO', isEditing ? 'success' : 'info');
}

function saveAll() {
  showNotification('✅ Todas as alterações salvas!', 'success');
}

function resetAll() {
  if (confirm('⚠️ Resetar todo o conteúdo personalizado?')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// Expor funções globalmente
window.adminSaveImage = (key, url) => {
  if (url && url.trim()) {
    const img = document.querySelector(`[data-storage-key="${key}"]`) || document.querySelector(`img[src*="${key}"]`);
    if (img) img.src = url.trim();
    saveContent(key, url.trim());
    showNotification('✅ Imagem atualizada!', 'success');
  }
};
window.adminSaveAll = saveAll;
window.adminReset = resetAll;
window.adminToggleEdit = toggleEditMode;

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  if (!isAdminLoggedIn()) return;
  
  // Mostrar indicador de admin
  const badge = document.createElement('div');
  badge.style.cssText = `
    position: fixed; top: 1rem; right: 1rem; z-index: 10000;
    background: #cf6357; color: #faf5e8; padding: 0.5rem 1rem;
    border-radius: 2rem; font-weight: 600; font-size: 0.85rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  `;
  badge.innerHTML = '👑 Admin | <button onclick="window.adminToggleEdit()" style="background:none;border:none;color:inherit;text-decoration:underline;cursor:pointer;">Ativar Edição</button>';
  document.body.appendChild(badge);
  
  toolbar = createToolbar();
  
  // ===== CONFIGURAR ELEMENTOS EDITÁVEIS =====
  
  // Hero
  makeEditable('.hero__title', 'hero_title', { badge: 'Título Hero' });
  makeEditable('.hero__subtitle', 'hero_subtitle', { badge: 'Subtítulo Hero', allowEnter: true });
  
  // Apresentação
  makeEditable('#apresentacao .grid-2 > div:first-child p', 'apresentacao_text', { badge: 'Texto Apresentação', allowEnter: true });
  
  // Objetivos
  makeEditable('#apresentacao .grid-2 ul', 'objetivos_list', { isHtml: true, badge: 'Lista Objetivos' });
  
  // Impacto Social/Acadêmico
  makeEditable('.section--alt .grid-2 .card:first-child h3', 'impacto_social_title', { badge: 'Título Impacto Social' });
  makeEditable('.section--alt .grid-2 .card:first-child p', 'impacto_social_text', { badge: 'Texto Impacto Social' });
  makeEditable('.section--alt .grid-2 .card:last-child h3', 'impacto_academico_title', { badge: 'Título Impacto Acadêmico' });
  makeEditable('.section--alt .grid-2 .card:last-child p', 'impacto_academico_text', { badge: 'Texto Impacto Acadêmico' });
  
  // Destaques (cards do carrossel)
  document.querySelectorAll('.destaque-item').forEach((item, i) => {
    makeEditable(` .destaque-item:nth-child(${i+1}) h3`, `destaque_${i}_title`, { badge: `Destaque ${i+1} Título` });
    makeEditable(` .destaque-item:nth-child(${i+1}) p`, `destaque_${i}_text`, { badge: `Destaque ${i+1} Texto` });
    makeEditable(` .destaque-item:nth-child(${i+1}) img`, `destaque_${i}_img`, { isImage: true, badge: `Destaque ${i+1} Imagem` });
  });
  
  // Equipe (slides do carrossel)
  document.querySelectorAll('.equipe-slide').forEach((slide, i) => {
    makeEditable(` .equipe-slide:nth-child(${i+1}) .equipe-slide__texto h3`, `equipe_${i}_title`, { badge: `Equipe ${i+1} Título` });
    makeEditable(` .equipe-slide:nth-child(${i+1}) .equipe-slide__texto p`, `equipe_${i}_text`, { badge: `Equipe ${i+1} Texto`, allowEnter: true });
    makeEditable(` .equipe-slide:nth-child(${i+1}) img`, `equipe_${i}_img`, { isImage: true, badge: `Equipe ${i+1} Imagem` });
  });
  
  // Notícias
  document.querySelectorAll('.news-card').forEach((card, i) => {
    makeEditable(` .news-card:nth-child(${i+1}) h3`, `noticia_${i}_title`, { badge: `Notícia ${i+1} Título` });
    makeEditable(` .news-card:nth-child(${i+1}) p`, `noticia_${i}_text`, { badge: `Notícia ${i+1} Texto` });
    makeEditable(` .news-card:nth-child(${i+1}) time`, `noticia_${i}_date`, { badge: `Notícia ${i+1} Data` });
  });
  
  // Eventos
  document.querySelectorAll('.section--alt .grid-2 .card').forEach((card, i) => {
    if (card.querySelector('h3')?.textContent?.includes('Seminário') || card.querySelector('h3')?.textContent?.includes('Palestra')) {
      makeEditable(` .section--alt .grid-2 .card:nth-child(${i+1}) h3`, `evento_${i}_title`, { badge: `Evento ${i+1} Título` });
      const ps = card.querySelectorAll('p');
      ps.forEach((p, pi) => {
        makeEditable(` .section--alt .grid-2 .card:nth-child(${i+1}) p:nth-child(${pi+1})`, `evento_${i}_p${pi}`, { badge: `Evento ${i+1} Info ${pi+1}` });
      });
    }
  });
  
  // Footer
  makeEditable('.footer__col:first-child h3', 'footer_title', { badge: 'Título Footer' });
  makeEditable('.footer__col:first-child p', 'footer_text', { badge: 'Texto Footer', allowEnter: true });
  
  console.log('🔧 Admin inline editing ativado');
});