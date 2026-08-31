// ============================================
// ADMIN - EDIÇÃO IN-LINE (CLICK TO EDIT)
// CON(S)CIÊNCIA POLÍTICA - UNIRIO
// ============================================

let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    addAdminButton();
    if (isAuthenticated) {
        enableInlineEditing();
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
    adminBtn.setAttribute('aria-label', isAuthenticated ? 'Painel Administrativo' : 'Login');
    adminBtn.title = isAuthenticated ? 'Abrir painel' : 'Fazer login';
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
// EDIÇÃO IN-LINE (CLICK TO EDIT)
// ============================================

function enableInlineEditing() {
    // Adicionar botões de edição em elementos editáveis
    const editables = document.querySelectorAll('.hero__title, .hero__subtitle, .section .grid-2 p, .section .grid-2 ul, .card h3, .card p');
    
    editables.forEach(el => {
        // Adicionar classe para indicar que é editável
        el.classList.add('editable-inline');
        el.style.cursor = 'pointer';
        el.style.position = 'relative';
        
        // Adicionar indicador visual
        el.addEventListener('mouseenter', function() {
            this.style.outline = '2px dashed #cf6357';
            this.style.outlineOffset = '4px';
        });
        el.addEventListener('mouseleave', function() {
            this.style.outline = 'none';
        });
        
        // Clique para editar
        el.addEventListener('click', function(e) {
            e.stopPropagation();
            openInlineEditor(this);
        });
    });
    
    // Adicionar estilo para o modo de edição
    const style = document.createElement('style');
    style.textContent = `
        .editable-inline {
            transition: all 0.2s;
            border-radius: 4px;
            padding: 4px;
        }
        .editable-inline.editing {
            outline: 3px solid #cf6357 !important;
            background: #fff8f0 !important;
        }
        .editable-inline .edit-hint {
            position: absolute;
            top: -20px;
            right: 0;
            font-size: 0.6rem;
            background: #cf6357;
            color: white;
            padding: 0 0.5rem;
            border-radius: 4px;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        .editable-inline:hover .edit-hint {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Adicionar hint em cada elemento
    editables.forEach(el => {
        const hint = document.createElement('span');
        hint.className = 'edit-hint';
        hint.textContent = '✏️ Clique para editar';
        el.style.position = 'relative';
        el.appendChild(hint);
    });
    
    console.log('✅ Modo de edição in-line ativado! Clique em qualquer texto para editar.');
}

// ============================================
// EDITOR IN-LINE
// ============================================

function openInlineEditor(element) {
    // Verificar se já está em modo de edição
    if (element.dataset.editing === 'true') return;
    
    // Salvar o conteúdo original
    const originalContent = element.innerHTML;
    const elementType = element.tagName.toLowerCase();
    const isList = elementType === 'ul' || elementType === 'ol';
    
    // Criar o editor
    const editor = document.createElement('div');
    editor.className = 'inline-editor';
    editor.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    // Conteúdo do editor
    let contentValue = '';
    if (isList) {
        const items = element.querySelectorAll('li');
        contentValue = Array.from(items).map(li => li.textContent.trim()).join('\n');
    } else {
        contentValue = element.textContent.trim();
    }
    
    editor.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
            <h3 style="color:#612a2a;font-family:'Playfair Display',serif;">✏️ Editar Conteúdo</h3>
            <button onclick="closeInlineEditor()" style="background:none;border:none;font-size:1.5rem;cursor:pointer;">✕</button>
        </div>
        <div style="margin-bottom:1rem;">
            <label style="display:block;font-weight:600;margin-bottom:0.3rem;font-size:0.9rem;">${isList ? 'Digite cada item em uma linha:' : 'Edite o texto:'}</label>
            <textarea id="inline-editor-textarea" style="width:100%;min-height:150px;padding:0.8rem;border:2px solid #e0d6c8;border-radius:0.8rem;font-family:inherit;font-size:1rem;resize:vertical;">${contentValue}</textarea>
        </div>
        <div style="display:flex;gap:0.8rem;flex-wrap:wrap;">
            <button onclick="saveInlineEdit()" style="background:#27ae60;color:white;border:none;padding:0.6rem 2rem;border-radius:2rem;font-weight:600;cursor:pointer;">💾 Salvar</button>
            <button onclick="closeInlineEditor()" style="background:#95a5a6;color:white;border:none;padding:0.6rem 2rem;border-radius:2rem;font-weight:600;cursor:pointer;">Cancelar</button>
        </div>
    `;
    
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'inline-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(4px);
        z-index: 10000;
    `;
    overlay.addEventListener('click', closeInlineEditor);
    
    document.body.appendChild(overlay);
    document.body.appendChild(editor);
    
    // Salvar referência ao elemento
    editor.dataset.targetElement = element.id || 'element';
    editor.dataset.isList = isList;
    editor.dataset.originalContent = originalContent;
    
    // Focar no textarea
    setTimeout(() => {
        document.getElementById('inline-editor-textarea').focus();
    }, 100);
    
    element.dataset.editing = 'true';
    element.classList.add('editing');
}

function closeInlineEditor() {
    document.querySelectorAll('.inline-editor').forEach(el => el.remove());
    document.querySelectorAll('.inline-overlay').forEach(el => el.remove());
    document.querySelectorAll('.editing').forEach(el => {
        el.dataset.editing = 'false';
        el.classList.remove('editing');
    });
}

function saveInlineEdit() {
    const editor = document.querySelector('.inline-editor');
    if (!editor) return;
    
    const textarea = document.getElementById('inline-editor-textarea');
    const isList = editor.dataset.isList === 'true';
    const content = textarea.value;
    
    // Encontrar o elemento alvo
    const targetElement = document.querySelector('.editing');
    if (!targetElement) {
        closeInlineEditor();
        return;
    }
    
    // Atualizar o conteúdo
    if (isList) {
        const items = content.split('\n').filter(line => line.trim());
        targetElement.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
    } else {
        targetElement.textContent = content;
    }
    
    // Salvar no localStorage
    saveContentToLocalStorage(targetElement, content);
    
    // Salvar também no editor de arquivos
    const savedFiles = JSON.parse(localStorage.getItem('votoConscienteEditedFiles') || '{}');
    savedFiles['/index.html'] = document.documentElement.outerHTML;
    localStorage.setItem('votoConscienteEditedFiles', JSON.stringify(savedFiles));
    
    closeInlineEditor();
    showNotification('✅ Conteúdo atualizado com sucesso!');
}

function saveContentToLocalStorage(element, content) {
    const saved = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    
    // Identificar qual seção foi editada
    let sectionId = 'conteudo';
    if (element.closest('.hero')) {
        sectionId = 'hero';
        // Para hero, salvar título e subtítulo separadamente
        const heroTitle = document.querySelector('.hero__title');
        const heroSub = document.querySelector('.hero__subtitle');
        if (heroTitle && heroSub) {
            saved.hero = heroTitle.textContent + '\n' + heroSub.textContent;
        }
    } else if (element.closest('#apresentacao') || element.closest('.section:first-of-type .grid-2 p')) {
        sectionId = 'apresentacao';
        saved.apresentacao = content;
    } else if (element.closest('.grid-2 ul') || element.closest('ul')) {
        sectionId = 'objetivos';
        const items = element.querySelectorAll('li');
        saved.objetivos = Array.from(items).map(li => li.textContent.trim()).join('\n');
    } else if (element.closest('#equipe') || element.closest('.card--team')) {
        sectionId = 'equipe';
        // Tentar salvar equipe
        const members = document.querySelectorAll('#equipe .card--team h3');
        if (members.length) {
            saved.equipe = Array.from(members).map(h3 => h3.textContent + ' - Membro').join('\n');
        }
    }
    
    localStorage.setItem('votoConscienteContent', JSON.stringify(saved));
}

function showNotification(message) {
    // Remover notificações antigas
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
        padding: 0.8rem 2rem;
        border-radius: 2rem;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-weight: 500;
        font-size: 1rem;
        opacity: 1;
        transition: opacity 0.4s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ============================================
// INICIALIZAR QUANDO O CONTEÚDO CARREGAR
// ============================================

// Observar mudanças no DOM para reaplicar edição
const observer = new MutationObserver(function(mutations) {
    if (isAuthenticated) {
        // Reaplicar edição em novos elementos
        document.querySelectorAll('.hero__title, .hero__subtitle, .section .grid-2 p, .section .grid-2 ul, .card h3, .card p:not(.card p .edit-hint)').forEach(el => {
            if (!el.classList.contains('editable-inline')) {
                el.classList.add('editable-inline');
                el.style.cursor = 'pointer';
                // Adicionar hint
                const hint = document.createElement('span');
                hint.className = 'edit-hint';
                hint.textContent = '✏️ Clique para editar';
                el.style.position = 'relative';
                el.appendChild(hint);
                // Adicionar eventos
                el.addEventListener('mouseenter', function() {
                    this.style.outline = '2px dashed #cf6357';
                    this.style.outlineOffset = '4px';
                });
                el.addEventListener('mouseleave', function() {
                    this.style.outline = 'none';
                });
                el.addEventListener('click', function(e) {
                    e.stopPropagation();
                    openInlineEditor(this);
                });
            }
        });
    }
});

observer.observe(document.body, { childList: true, subtree: true });

console.log('✅ Admin.js carregado - Modo de edição in-line ativado!');
