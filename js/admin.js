// ============================================
// ADMIN - EDIÇÃO DIRETA NA PÁGINA
// CON(S)CIÊNCIA POLÍTICA - UNIRIO
// ============================================

let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    addAdminButton();
    if (isAuthenticated) {
        enableDirectEditing();
    }
});

function checkSession() {
    const session = localStorage.getItem('votoConscienteSession');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (data.username === 'admin' && data.expires && data.expires > Date.now()) {
                isAuthenticated = true;
            }
        } catch(e) {}
    }
}

function addAdminButton() {
    if (document.getElementById('admin-toggle')) return;
    
    const adminBtn = document.createElement('div');
    adminBtn.id = 'admin-toggle';
    adminBtn.className = 'admin-float-btn';
    adminBtn.innerHTML = isAuthenticated ? '👑' : '🔐';
    adminBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: ${isAuthenticated ? '#27ae60' : '#612a2a'};
        color: #faf5e8;
        border: none;
        font-size: 28px;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    adminBtn.addEventListener('click', function() {
        if (isAuthenticated) {
            window.location.href = 'admin/index.html';
        } else {
            window.location.href = 'admin/login.html';
        }
    });
    
    document.body.appendChild(adminBtn);
}

// ============================================
// EDIÇÃO DIRETA NA PÁGINA (CONTENTEDITABLE)
// ============================================

function enableDirectEditing() {
    // Elementos que podem ser editados
    const editables = document.querySelectorAll(
        '.hero__title, .hero__subtitle, ' +
        '.section .grid-2 p, .section .grid-2 ul, ' +
        '.card h3, .card p, .news-card h3, .news-card p, ' +
        '.section-title'
    );
    
    editables.forEach(el => {
        // Tornar editável
        el.contentEditable = true;
        el.setAttribute('spellcheck', 'true');
        
        // Estilo visual
        el.style.transition = 'all 0.2s';
        el.style.borderRadius = '4px';
        el.style.padding = '4px 8px';
        el.style.margin = '-4px -8px';
        
        // Indicador visual ao passar o mouse
        el.addEventListener('mouseenter', function() {
            if (!this.classList.contains('editing')) {
                this.style.backgroundColor = 'rgba(207, 99, 87, 0.08)';
                this.style.outline = '2px dashed #cf6357';
                this.style.outlineOffset = '2px';
            }
        });
        
        el.addEventListener('mouseleave', function() {
            if (!this.classList.contains('editing')) {
                this.style.backgroundColor = 'transparent';
                this.style.outline = 'none';
            }
        });
        
        // Salvar ao perder o foco
        el.addEventListener('blur', function() {
            this.classList.remove('editing');
            this.style.backgroundColor = 'transparent';
            this.style.outline = 'none';
            saveContent(this);
        });
        
        // Salvar com Ctrl+Enter
        el.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                this.blur();
            }
            if (e.key === 'Escape') {
                this.blur();
            }
        });
        
        // Foco - modo edição
        el.addEventListener('focus', function() {
            this.classList.add('editing');
            this.style.backgroundColor = 'rgba(207, 99, 87, 0.1)';
            this.style.outline = '3px solid #cf6357';
            this.style.outlineOffset = '2px';
        });
        
        // Adicionar indicação "Clique para editar"
        const hint = document.createElement('span');
        hint.className = 'edit-hint';
        hint.textContent = '✏️ Clique e edite';
        hint.style.cssText = `
            position: absolute;
            top: -22px;
            right: 0;
            font-size: 0.6rem;
            background: #cf6357;
            color: white;
            padding: 0 0.5rem;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            font-weight: 600;
            letter-spacing: 0.5px;
        `;
        el.style.position = 'relative';
        el.appendChild(hint);
        
        el.addEventListener('mouseenter', function() {
            const hintEl = this.querySelector('.edit-hint');
            if (hintEl) hintEl.style.opacity = '1';
        });
        
        el.addEventListener('mouseleave', function() {
            const hintEl = this.querySelector('.edit-hint');
            if (hintEl) hintEl.style.opacity = '0';
        });
    });
    
    // Estilo para o modo de edição
    const style = document.createElement('style');
    style.textContent = `
        .editing {
            background: rgba(207, 99, 87, 0.1) !important;
            outline: 3px solid #cf6357 !important;
            outline-offset: 2px !important;
            border-radius: 4px !important;
        }
        [contenteditable="true"]:focus {
            outline: none !important;
        }
        .edit-hint {
            position: absolute !important;
            top: -22px !important;
            right: 0 !important;
            font-size: 0.6rem !important;
            background: #cf6357 !important;
            color: white !important;
            padding: 0 0.5rem !important;
            border-radius: 4px !important;
            opacity: 0 !important;
            transition: opacity 0.3s !important;
            pointer-events: none !important;
            font-weight: 600 !important;
            letter-spacing: 0.5px !important;
        }
        [contenteditable="true"]:hover .edit-hint {
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✅ Modo de edição direta ativado! Clique em qualquer texto para editar.');
}

// ============================================
// SALVAR CONTEÚDO
// ============================================

function saveContent(element) {
    // Identificar qual seção foi editada
    let sectionId = 'conteudo';
    let content = element.textContent.trim();
    
    const saved = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    
    if (element.classList.contains('hero__title')) {
        sectionId = 'hero';
        const sub = document.querySelector('.hero__subtitle');
        saved.hero = content + '\n' + (sub ? sub.textContent.trim() : '');
    } else if (element.classList.contains('hero__subtitle')) {
        sectionId = 'hero';
        const title = document.querySelector('.hero__title');
        saved.hero = (title ? title.textContent.trim() : '') + '\n' + content;
    } else if (element.closest('.section') && element.closest('.grid-2 p')) {
        sectionId = 'apresentacao';
        saved.apresentacao = content;
    } else if (element.closest('.grid-2 ul')) {
        sectionId = 'objetivos';
        const items = element.querySelectorAll('li');
        saved.objetivos = Array.from(items).map(li => li.textContent.trim()).join('\n');
    } else if (element.closest('.card')) {
        sectionId = 'cards';
        // Salvar cards
        const cards = document.querySelectorAll('.card');
        saved.cards = Array.from(cards).map(card => {
            const title = card.querySelector('h3');
            const desc = card.querySelector('p');
            return (title ? title.textContent.trim() : '') + ' - ' + (desc ? desc.textContent.trim() : '');
        }).join('\n');
    } else if (element.closest('.section-title')) {
        sectionId = 'section-title';
        // Atualizar título da seção
        const section = element.closest('.section');
        if (section && section.id) {
            saved[section.id + '_title'] = content;
        }
    }
    
    localStorage.setItem('votoConscienteContent', JSON.stringify(saved));
    
    // Salvar também no editor de arquivos
    try {
        const savedFiles = JSON.parse(localStorage.getItem('votoConscienteEditedFiles') || '{}');
        savedFiles['/index.html'] = document.documentElement.outerHTML;
        localStorage.setItem('votoConscienteEditedFiles', JSON.stringify(savedFiles));
    } catch(e) {}
    
    showNotification('✅ Conteúdo salvo!');
}

function showNotification(message) {
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #27ae60;
        color: white;
        padding: 0.6rem 1.5rem;
        border-radius: 2rem;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-weight: 500;
        font-size: 0.9rem;
        opacity: 1;
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 2000);
}

// ============================================
// CARREGAR CONTEÚDO SALVO
// ============================================

function loadSavedContent() {
    const saved = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    
    // Aplicar hero
    if (saved.hero) {
        const parts = saved.hero.split('\n');
        const title = document.querySelector('.hero__title');
        const sub = document.querySelector('.hero__subtitle');
        if (title) title.textContent = parts[0] || title.textContent;
        if (sub && parts[1]) sub.textContent = parts.slice(1).join('\n');
    }
    
    // Aplicar apresentacao
    if (saved.apresentacao) {
        const p = document.querySelector('.section:first-of-type .grid-2 p');
        if (p) p.textContent = saved.apresentacao;
    }
    
    // Aplicar objetivos
    if (saved.objetivos) {
        const ul = document.querySelector('.section:first-of-type .grid-2 ul');
        if (ul) {
            const items = saved.objetivos.split('\n').filter(l => l.trim());
            ul.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
        }
    }
}

// Carregar conteúdo salvo ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    loadSavedContent();
});

console.log('✅ Admin.js carregado - Edição direta na página!');
