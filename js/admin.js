// Admin Inline Editing - Versão endurecida: apenas admins logados podem editar

const STORAGE_KEY = 'votoConscienteContent';
const ADMIN_SESSION_KEY = 'votoConscienteSession';

/**
 * Verifica se há um admin logado com validações rigorosas
 * Retorna true APENAS se: sessão existir, username for 'admin' e não expirada
 */
function isAdminLoggedIn() {
  const session = localStorage.getItem(ADMIN_SESSION_KEY);
  if (!session) return false;
  
  try {
    const data = JSON.parse(session);
    
    // Verificações rigorosas
    if (typeof data !== 'object' || data === null) return false;
    if (data.username !== 'admin') return false;
    if (typeof data.expires !== 'number') return false; // Sem data de expiração = inválido
    if (data.expires < Date.now()) {
      // Sessão expirada - limpar e retornar falso
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return false;
    }
    
    return true;
  } catch (e) {
    // Erro ao fazer parse - sessão corrompida
    localStorage.removeItem(ADMIN_SESSION_KEY);
    return false;
  }
}

/**
 * Remove TODAS as funcionalidades de admin do DOM
 * Isto deve ser chamado quando NÃO é admin para garantir limpeza total
 */
function removeAllAdminFeatures() {
  // 1. Remover estilos injectados
  const adminStyles = document.getElementById('admin-inline-styles');
  if (adminStyles) adminStyles.remove();
  
  // 2. Remover badge topo admin
  const topBadge = document.querySelector('.admin-badge-top');
  if (topBadge) topBadge.remove();
  
  // 3. Remover toolbar inferior
  const toolbar = document.getElementById('admin-toolbar');
  if (toolbar) toolbar.remove();
  
  // 4. Remover contenteditable de TODOS os elementos
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    el.removeAttribute('contenteditable');
    el.classList.remove('admin-editable');
    // Remover badges de edição
    el.querySelectorAll('.admin-edit-badge').forEach(b => b.remove());
  });
  
  // 5. Remover outlines de elementos editáveis
  document.querySelectorAll('.admin-editable').forEach(el => {
    el.style.outline = 'none';
    el.classList.remove('admin-editable');
  });
  
  // 6. Remover overlays de imagem
  document.querySelectorAll('.admin-img-container').forEach(el => el.remove());
  
  // 6. Limpar global state
  window.isEditing = false;
  window.toolbar = null;
}

/**
 * Injeta estilos CSS APENAS se admin estiver logado
 */
function injectAdminStylesIfAllowed() {
  if (!isAdminLoggedIn()) return false;
  
  const style = document.createElement('style');
  style.id = 'admin-inline-styles';
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
    .admin-badge-top {
      position: fixed; top: 1rem; right: 1rem; z-index: 10000;
      background: #cf6357; color: #faf5e8; padding: 0.5rem 1rem;
      border-radius: 2rem; font-weight: 600; font-size: 0.85rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
  `;
  document.head.appendChild(style);
  return true;
}

/*============================================================================
  INICIALIZAÇÃO - Versão Segura
  ==========================================================================*/
document.addEventListener('DOMContentLoaded', () => {
  // PRIMEIRO: Remover qualquer feature admin remanescente (segurança por defeito)
  removeAllAdminFeatures();
  
  // SEGUNDO: Verificar se é admin
  const isAdmin = isAdminLoggedIn();
  
  if (!isAdmin) {
    // Não é admin - garantir que nada admin reste
    // (removeAllAdminFeatures() já foi chamado acima)
    console.log('🔒 Acesso não-admin detectado - funcionalidades de edição desativadas');
    return;
  }
  
  // É admin - now safe to inject styles and setup editing
  const stylesInjected = injectAdminStylesIfAllowed();
  
  if (!stylesInjected) {
    // Should not happen, but safety net
    removeAllAdminFeatures();
    return;
  }
  
  // Mostrar indicador de admin no topo
  const badge = document.createElement('div');
  badge.className = 'admin-badge-top';
  badge.innerHTML = '👑 Admin | <button onclick="window.adminToggleEdit()" style="background:none;border:none;color:inherit;text-decoration:underline;cursor:pointer;">Ativar Edição</button>';
  document.body.appendChild(badge);
  
  // Inicializar toolbar
  window.toolbar = createToolbar();
  
  // ===== CONFIGURAR ELEMENTOS EDITÁVEIS (APENAS PARA ADMIN) =====
  
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
        
        // Enter para salvar
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
  
  // ===== FUNÇÕES GLOBAIS =====
  
  window.adminSaveImage = (key, url) => {
    if (url && url.trim()) {
      const img = document.querySelector(`[data-storage-key="${key}"]`) || document.querySelector(`img[src*="${key}"]`);
      if (img) img.src = url.trim();
      saveContent(key, url.trim());
      showNotification('✅ Imagem atualizada!', 'success');
    }
  };
  window.adminSaveAll = () => {
    showNotification('✅ Todas as alterações salvas!', 'success');
    // Salvamento real seria disparado pelos blurs dos elementos
  };
  window.adminReset = () => {
    if (confirm('⚠️ Resetar todo o conteúdo personalizado?')) {
      localStorage.removeItem(STORAGE_KEY);
      removeAllAdminFeatures();
      location.reload();
    }
  };
  window.adminToggleEdit = () => {
    window.isEditing = !window.isEditing;
    document.querySelectorAll('.admin-editable, .admin-img-container').forEach(el => {
      el.style.pointerEvents = window.isEditing ? 'auto' : 'none';
      if (el.classList.contains('admin-editable')) {
        el.setAttribute('contenteditable', window.isEditing);
      }
    });
    if (window.toolbar) {
      window.toolbar.classList.toggle('show', window.isEditing);
      window.toolbar.querySelector('button:last-child').textContent = 
        window.isEditing ? '👁️ Desativar Edição' : '👁️ Ativar Edição';
    }
    showNotification(window.isEditing ? '✏️ Modo edição ATIVADO' : '👁️ Modo edição DESATIVADO', window.isEditing ? 'success' : 'info');
  };
  
  // ===== CONFIGURAR ELEMENTOS =====
  
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
  makeEditable('.footer__col:first-child h3', 'footer_title', { badge: 'Título Footer' });
  makeEditable('.footer__col:first-child p', 'footer_text', { badge: 'Texto Footer', allowEnter: true });
  
  console.log('🔧 Admin inline editing ativado - apenas para administradores logados');
});