// Admin Inline Editing - Versão corrigida para garantir que edição funcione

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

/**
 * Verifica se há um admin logado com validações rigorosas
 */
function isAdminLoggedIn() {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) {
    console.log('❌ Nenhuma sessão encontrada');
    return false;
  }
  try {
    const data = JSON.parse(session);
    if (typeof data !== 'object' || data === null) return false;
    if (data.username !== 'admin') return false;
    if (typeof data.expires !== 'number') return false;
    if (data.expires < Date.now()) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    console.log('👑 Login admin verificado!');
    return true;
  } catch (e) {
    console.error('❌ Erro ao parsear sessão:', e);
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
}

/**
 * Remove TODAS as funcionalidades de admin do DOM (segurança por defeito)
 */
function removeAllAdminFeatures() {
  // Remover estilos
  const adminStyles = document.getElementById('admin-inline-styles');
  if (adminStyles) adminStyles.remove();
  
  // Remover badge topo
  const topBadge = document.querySelector('.admin-badge-top');
  if (topBadge) topBadge.remove();
  
  // Remover toolbar
  const toolbar = document.getElementById('admin-toolbar');
  if (toolbar) toolbar.remove();
  
  // Remover contenteditable de TODOS os elementos
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.removeAttribute('contenteditable');
    el.classList.remove('admin-editable');
    // Remover badges
    el.querySelectorAll('.admin-edit-badge').forEach(b => b.remove());
  });
  
  // Remover outlines
  document.querySelectorAll('.admin-editable').forEach(el => {
    el.style.outline = 'none';
    el.classList.remove('admin-editable');
  });
  
  // Remover overlays de imagem
  document.querySelectorAll('.admin-img-container').forEach(el => el.remove());
  
  // Limpar global
  window.isEditing = false;
  window.toolbar = null;
}

/**
 * Injeta estilos APENAS se admin estiver logado
 */
function injectAdminStylesIfAllowed() {
  if (!isAdminLoggedIn()) return false;
  
  const style = document.createElement('style');
  style.id = 'admin-inline-styles';
  style.textContent = `
    .admin-editable { outline: 2px dashed transparent; transition: outline 0.2s; position: relative; }
    .admin-editable:hover { outline-color: #cf6357; }
    .admin-editable:focus { outline-color: #cf6357; background: #fffef8; }
    .admin-edit-badge {
      position: absolute; top: -8px; right: -8px; background: #cf6357; color: #faf5e8;
      font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: 700;
      opacity: 0; transition: opacity 0.2s; pointer-events: none; white-space: nowrap;
    }
    .admin-editable:hover .admin-edit-badge { opacity: 1; }
    .admin-toolbar { position: fixed; bottom: 1rem; left: 50%; transform: translateX(-50%); 
      background: #2c1e1f; color: #faf5e8; padding: 0.8rem 1.5rem; border-radius: 2rem; 
      display: flex; gap: 0.5rem; z-index: 1000; box-shadow: 0 4px 20px rgba(0,0,0,0.2); display: none; }
    .admin-toolbar.show { display: flex; }
    .admin-toolbar button { background: #cf6357; color: #faf5e8; border: none; padding: 0.4rem 1rem; 
      border-radius: 2rem; font-weight: 600; cursor: pointer; font-size: 0.85rem; transition: background 0.2s; }
    .admin-toolbar button:hover { background: #74402d; }
    .admin-toolbar button.secondary { background: #95a5a6; }
    .admin-toolbar button.secondary:hover { background: #7f8c8d; }
    .admin-img-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(44,30,31,0.7); color: #faf5e8; display: flex; flex-direction: column; align-items: center; justify-content: center; 
      gap: 0.5rem; opacity: 0; transition: opacity 0.2s; pointer-events: none; border-radius: inherit; }
    .admin-img-container:hover .admin-img-overlay { opacity: 1; pointer-events: auto; }
    .admin-img-overlay input { max-width: 90%; padding: 0.3rem; border-radius: 4px; border: none; font-size: 0.85rem; }
    .admin-badge-top { position: fixed; top: 1rem; right: 1rem; z-index: 10000; 
      background: #cf6357; color: #faf5e8; padding: 0.5rem 1rem; border-radius: 2rem; font-weight: 600; font-size: 0.85rem; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.2); }
  `;
  document.head.appendChild(style);
  return true;
}

/*============================================================================
  INICIALIZAÇÃO
  ==========================================================================*/
document.addEventListener('DOMContentLoaded', () => {
  // 1. PRIMEIRO: Remover qualquer feature admin remanescente (segurança por defeito)
  removeAllAdminFeatures();
  
  // 2. SEGUNDO: Verificar se é admin
  const isAdmin = isAdminLoggedIn();
  
  if (!isAdmin) {
    console.log('🔒 Acesso não-admin - edição desativada');
    return;
  }
  
  // 3. É admin - injetar estilos
  const stylesInjected = injectAdminStylesIfAllowed();
  if (!stylesInjected) {
    removeAllAdminFeatures();
    return;
  }
  
  // 4. Mostrar indicador de admin
  const badge = document.createElement('div');
  badge.className = 'admin-badge-top';
  badge.innerHTML = '👑 Admin | <button id="admin-toggle-btn" style="background:none;border:none;color:inherit;text-decoration:underline;cursor:pointer;">Ativar Edição</button>';
  document.body.appendChild(badge);
  
  // 5. Criar toolbar
  window.toolbar = createToolbar();
  
  // 6. Função para tornar elementos editáveis
  function makeEditable(selector, storageKey, options = {}) {
    const elements = document.querySelectorAll(selector);
    const savedContent = getSavedContent();
    
    elements.forEach((el, index) => {
      const key = options.multiple ? `${storageKey}_${index}` : storageKey;
      
      // Aplicar conteúdo salvo
      if (savedContent[key]) {
        if (options.isImage) el.src = savedContent[key];
        else if (options.isHtml) el.innerHTML = savedContent[key];
        else el.textContent = savedContent[key];
      }
      
      // Tornar editável
      el.classList.add('admin-editable');
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('data-storage-key', key);
      
      // Adicionar badge de edição
      const existingBadge = el.querySelector('.admin-edit-badge');
      if (!existingBadge) {
        const badge = document.createElement('span');
        badge.className = 'admin-edit-badge';
        badge.textContent = options.badge || '✏️ Editar';
        el.appendChild(badge);
      }
      
      // Salvar ao perder foco
      el.addEventListener('blur', () => {
        const value = options.isHtml ? el.innerHTML : el.textContent;
        saveContent(key, value);
        showNotification('✅ Texto salvo!', 'success');
      });
      
      // Enter para salvar
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
  
  // Função para criar a toolbar
  function createToolbar() {
    const toolbar = document.createElement('div');
    toolbar.id = 'admin-toolbar';
    toolbar.innerHTML = `
      <button onclick="window.adminToggleEdit()">💾 Salvar Tudo</button>
      <button class="secondary" onclick="window.adminReset()">🔄 Resetar</button>
      <button class="secondary" onclick="window.adminToggleEdit()">👁️ Desativar Edição</button>
    `;
    document.body.appendChild(toolbar);
    return toolbar;
  }
  
  // Função de toggle de edição
  window.adminToggleEdit = () => {
    window.isEditing = !window.isEditing;
    
    // Encontrar todos os elementos editáveis
    const editableEls = document.querySelectorAll('.admin-editable, .admin-img-container');
    
    console.log('🔧 Toggle edit mode:', window.isEditing);
    console.log('🔍 Elementos encontrados:', editableEls.length);
    
    editableEls.forEach(el => {
      // Garantir que tem a classe admin-editable
      if (el.classList.contains('admin-editable')) {
        el.style.pointerEvents = window.isEditing ? 'auto' : 'none';
        el.setAttribute('contenteditable', window.isEditing);
        console.log('✅ Elemento configurado:', el.tagName, el.textContent.substring(0,30));
      } else {
        console.log('❌ Elemento sem classe admin-editable:', el.tagName);
      }
    });
    
    // Toggle da toolbar
    if (window.toolbar) {
      window.toolbar.classList.toggle('show', window.isEditing);
      const btn = window.toolbar.querySelector('button:last-child');
      if (btn) btn.textContent = window.isEditing ? '👁️ Desativar Edição' : '👁️ Ativar Edição';
    }
    
    showNotification(window.isEditing ? '✏️ Modo edição ATIVADO' : '👁️ Modo edição DESATIVADO', window.isEditing ? 'success' : 'info');
  };
  
  // Funções globais
  window.adminSaveImage = (key, url) => {
    if (url && url.trim()) {
      const img = document.querySelector(`[data-storage-key="${key}"]`) || document.querySelector(`img[src*="${key}"]`);
      if (img) img.src = url.trim();
      saveContent(key, url.trim());
      showNotification('✅ Imagem atualizada!', 'success');
    }
  };
  window.adminSaveAll = () => showNotification('✅ Todas as alterações salvas!', 'success');
  window.adminReset = () => {
    if (confirm('⚠️ Resetar todo o conteúdo personalizado?')) {
      localStorage.removeItem(STORAGE_KEY);
      removeAllAdminFeatures();
      location.reload();
    }
  };
  
  // ===== CONFIGURAR ELEMENTOS EDITÁVEIS =====
  
  // Hero
  makeEditable('.hero__title', 'hero_title', { badge: 'Título Hero', allowEnter: true });
  makeEditable('.hero__subtitle', 'hero_subtitle', { badge: 'Subtítulo Hero', allowEnter: true });
  
  // Apresentação
  makeEditable('#apresentacao .grid-2 > div:first-child p', 'apresentacao_text', { badge: 'Texto Apresentação', allowEnter: true });
  makeEditable('#apresentacao .grid-2 ul', 'objetivos_list', { isHtml: true, badge: 'Lista Objetivos' });
  
  // Impacto
  makeEditable('.section--alt .grid-2 .card:first-child h3', 'impacto_social_title', { badge: 'Título Impacto Social' });
  makeEditable('.section--alt .grid-2 .card:first-child p', 'impacto_social_text', { badge: 'Texto Impacto Social' });
  makeEditable('.section--alt .grid-2 .card:last-child h3', 'impacto_academico_title', { badge: 'Título Impacto Acadêmico' });
  makeEditable('.section--alt .grid-2 .card:last-child p', 'impacto_academico_text', { badge: 'Texto Impacto Acadêmico' });
  
  // Destaques
  document.querySelectorAll('.destaque-item').forEach((item, i) => {
    makeEditable(` .destaque-item:nth-child(${i+1}) h3`, `destaque_${i}_title`, { badge: `Destaque ${i+1} Título` });
    makeEditable(` .destaque-item:nth-child(${i+1}) p`, `destaque_${i}_text`, { badge: `Destaque ${i+1} Texto` });
    makeEditable(` .destaque-item:nth-child(${i+1}) img`, `destaque_${i}_img`, { isImage: true, badge: `Destaque ${i+1} Imagem` });
  });
  
  // Equipe
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
  makeEditable('.footer__col:first-child h3', 'footer_title', { badge: 'Título Footer', allowEnter: true });
  makeEditable('.footer__col:first-child p', 'footer_text', { badge: 'Texto Footer', allowEnter: true });
  
  console.log('🔧 Admin inline editing ATIVADO - todos os elementos configurados');
});