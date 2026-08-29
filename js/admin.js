// ============================================
// ADMIN - SISTEMA DE ADMINISTRAÇÃO
// CON(S)CIÊNCIA POLÍTICA - UNIRIO
// ============================================

const MASTER_USER = {
    username: 'admin',
    password: 'unirio2026',
    name: 'Administrador UNIRIO'
};

let isAuthenticated = false;
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    addAdminButton();
    initInteractiveButtons();
    if (isAuthenticated) {
        enableEditing();
        addEditButtons();
    }
});

function checkSession() {
    const session = localStorage.getItem('votoConscienteSession');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (data.username === MASTER_USER.username) {
                isAuthenticated = true;
                currentUser = data;
                console.log('✅ Usuário logado:', currentUser.name);
            }
        } catch(e) {
            localStorage.removeItem('votoConscienteSession');
        }
    }
}

function addAdminButton() {
    const oldBtn = document.getElementById('admin-toggle');
    if (oldBtn) oldBtn.remove();

    const footer = document.querySelector('.footer__bottom');
    if (!footer) return;

    const adminBtn = document.createElement('div');
    adminBtn.id = 'admin-toggle';
    adminBtn.className = 'admin-footer-btn';
    adminBtn.innerHTML = isAuthenticated ? '👑' : '•';
    adminBtn.setAttribute('aria-label', 'Acesso administrativo');
    adminBtn.title = '';
    adminBtn.style.cssText = `
        position: absolute;
        bottom: 5px;
        right: 10px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: transparent;
        color: transparent;
        cursor: pointer;
        opacity: 0.3;
        transition: all 0.3s;
        font-size: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        user-select: none;
        z-index: 9999;
    `;

    let clicks = 0;
    adminBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        clicks++;
        if (clicks >= 5) {
            clicks = 0;
            if (isAuthenticated) {
                openAdminPanel();
            } else {
                openLoginModal();
            }
        }
        setTimeout(() => { adminBtn.style.opacity = '0.3'; }, 200);
    });

    footer.style.position = 'relative';
    footer.appendChild(adminBtn);
}

function openLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'login-modal';
    
    modal.innerHTML = `
        <div class="modal-content" role="dialog" aria-labelledby="login-title">
            <button class="modal-close" onclick="closeModal('login-modal')" aria-label="Fechar">✕</button>
            <h2 id="login-title">🔐 Acesso Administrativo</h2>
            <p>Digite suas credenciais para acessar o painel de edição.</p>
            <form id="login-form" onsubmit="handleLogin(event)">
                <div class="form-group">
                    <label for="login-user">Usuário</label>
                    <input type="text" id="login-user" placeholder="admin" required>
                </div>
                <div class="form-group">
                    <label for="login-pass">Senha</label>
                    <input type="password" id="login-pass" placeholder="••••••••" required>
                </div>
                <div id="login-error" class="error-message" style="display:none;">Usuário ou senha inválidos!</div>
                <button type="submit" class="btn btn--primary" style="width:100%;">Entrar</button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.getElementById('login-user').focus();
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;
    
    if (username === MASTER_USER.username && password === MASTER_USER.password) {
        isAuthenticated = true;
        currentUser = { username, name: MASTER_USER.name };
        
        localStorage.setItem('votoConscienteSession', JSON.stringify(currentUser));
        
        const btn = document.getElementById('admin-toggle');
        if (btn) {
            btn.innerHTML = '👑';
            btn.style.opacity = '0.5';
        }
        
        closeModal('login-modal');
        mostrarNotificacaoAcessibilidade('✅ Bem-vindo, ' + MASTER_USER.name + '! Modo de edição ativado.');
        
        enableEditing();
        addEditButtons();
        setTimeout(() => openAdminPanel(), 500);
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

function logout() {
    isAuthenticated = false;
    currentUser = null;
    localStorage.removeItem('votoConscienteSession');
    
    const btn = document.getElementById('admin-toggle');
    if (btn) {
        btn.innerHTML = '•';
        btn.style.opacity = '0.3';
    }
    
    disableEditing();
    removeEditButtons();
    mostrarNotificacaoAcessibilidade('🔓 Logout realizado com sucesso.');
}

function openAdminPanel() {
    window.location.href = 'admin-panel.html';
}

function enableEditing() {
    document.querySelectorAll('.section, .hero, .card').forEach(el => {
        el.classList.add('editable');
        el.addEventListener('dblclick', function(e) {
            const section = this.closest('.section') || this;
            const id = section.id || 'conteudo';
            if (id) {
                editSection(id);
            }
        });
    });
}

function disableEditing() {
    document.querySelectorAll('.editable').forEach(el => {
        el.classList.remove('editable');
    });
}

function addEditButtons() {
    if (!isAuthenticated) return;
    
    document.querySelectorAll('.section, .hero, .card').forEach(el => {
        if (el.querySelector('.edit-float-btn')) return;
        
        const btn = document.createElement('button');
        btn.className = 'edit-float-btn';
        btn.innerHTML = '✏️';
        btn.title = 'Editar esta seção';
        btn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: var(--cor-destaque);
            color: var(--texto-claro);
            border: none;
            border-radius: 50%;
            width: 35px;
            height: 35px;
            cursor: pointer;
            font-size: 0.9rem;
            opacity: 0;
            transition: opacity 0.3s;
            z-index: 50;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        
        if (!el.style.position || el.style.position === 'static') {
            el.style.position = 'relative';
        }
        el.appendChild(btn);
        
        el.addEventListener('mouseenter', () => btn.style.opacity = '1');
        el.addEventListener('mouseleave', () => btn.style.opacity = '0');
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = el.id || 'conteudo';
            editSection(id);
        });
    });
}

function removeEditButtons() {
    document.querySelectorAll('.edit-float-btn').forEach(el => el.remove());
}

function editSection(sectionId) {
    const existing = document.getElementById('edit-modal');
    if (existing) existing.remove();

    const savedContent = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    let currentContent = savedContent[sectionId] || getContentFromDOM(sectionId) || '';

    const configs = {
        'hero': { title: '🎨 Editar Hero', label: 'Texto do Hero (use <br> para quebras)', placeholder: 'Digite o título e subtítulo...' },
        'apresentacao': { title: '📝 Editar Apresentação', label: 'Texto de apresentação', placeholder: 'Digite o texto de apresentação...' },
        'objetivos': { title: '🎯 Editar Objetivos', label: 'Lista de objetivos (um por linha)', placeholder: 'Objetivo 1\nObjetivo 2' },
        'equipe': { title: '👥 Editar Equipe', label: 'Membros (Nome - Cargo)', placeholder: 'Ana Silva - Coordenadora' },
        'eventos': { title: '📅 Editar Eventos', label: 'Eventos (Nome - Data - Local)', placeholder: 'Oficina - 15/04/2026 - UNIRIO' },
        'noticias': { title: '📰 Editar Notícias', label: 'Notícias (Título - Data - Descrição)', placeholder: 'Lançamento - 01/03/2026 - Descrição' },
        'cards': { title: '🃏 Editar Cards', label: 'Cards (Título - Descrição - Link)', placeholder: 'Eleições - Entenda - eleicoes-2026.html' },
        'footer': { title: '📌 Editar Rodapé', label: 'Texto do rodapé', placeholder: 'Digite o texto do rodapé...' },
        'candidatos': { title: '🗳️ Editar Candidatos', label: 'Candidatos (Nome - Partido - Número)', placeholder: 'Candidato A - PT - 13' }
    };

    const config = configs[sectionId] || { title: '✏️ Editar', label: 'Conteúdo', placeholder: 'Digite...' };

    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'edit-modal';
    modal.innerHTML = `
        <div class="modal-content edit-modal" role="dialog">
            <button class="modal-close" onclick="closeEditModal()">✕</button>
            <h2>${config.title}</h2>
            <div class="form-group">
                <label for="edit-content">${config.label}</label>
                <textarea id="edit-content" placeholder="${config.placeholder}">${currentContent}</textarea>
            </div>
            <div class="form-actions" style="display:flex; gap:1rem; margin-top:1rem;">
                <button class="btn btn--primary" onclick="saveEdit('${sectionId}')">💾 Salvar</button>
                <button class="btn btn-cancel" onclick="closeEditModal()" style="background:#e0d6c8; color:var(--texto); border:none; padding:0.7rem 1.5rem; border-radius:2rem; cursor:pointer;">Cancelar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('edit-content').focus();
}

function getContentFromDOM(sectionId) {
    const content = {
        'hero': () => {
            const h1 = document.querySelector('.hero__title');
            const p = document.querySelector('.hero__subtitle');
            return h1 ? h1.textContent + '\n' + (p ? p.textContent : '') : '';
        },
        'apresentacao': () => {
            const p = document.querySelector('.section:first-of-type .grid-2 p');
            return p ? p.textContent : '';
        }
    };
    return content[sectionId] ? content[sectionId]() : '';
}

function saveEdit(sectionId) {
    const content = document.getElementById('edit-content').value;
    const savedContent = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    savedContent[sectionId] = content;
    localStorage.setItem('votoConscienteContent', JSON.stringify(savedContent));
    updateStats();
    mostrarNotificacaoAcessibilidade('✅ Conteúdo salvo com sucesso!', 'success');
    closeEditModal();
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.remove();
}

function updateStats() {
    const content = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    const stat = document.getElementById('stat-edits');
    if (stat) stat.textContent = Object.keys(content).length;
}

function confirmReset() {
    if (confirm('⚠️ Tem certeza que deseja restaurar o conteúdo padrão?')) {
        if (confirm('🔄 Confirme novamente: resetar tudo?')) {
            localStorage.removeItem('votoConscienteContent');
            updateStats();
            mostrarNotificacaoAcessibilidade('🔄 Conteúdo restaurado para o padrão.', 'warning');
            setTimeout(() => location.reload(), 2000);
        }
    }
}

function initInteractiveButtons() {
    const saibaMaisBtn = document.querySelector('.hero .btn--primary');
    if (saibaMaisBtn) {
        saibaMaisBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'sobre.html';
        });
    }
    
    document.querySelectorAll('.card--link').forEach(card => {
        card.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                return;
            }
            e.preventDefault();
            const title = this.querySelector('h3')?.textContent || 'Página';
            mostrarNotificacaoAcessibilidade(`🔜 Página "${title}" em desenvolvimento`);
        });
    });
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.remove();
    }
}

function mostrarNotificacaoAcessibilidade(message, type = 'info') {
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    const colors = { success: '#27ae60', warning: '#f39c12', error: '#e74c3c', info: 'var(--cor-destaque)' };
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    notification.style.background = colors[type] || 'var(--cor-principal)';
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        left: 50%;
        transform: translateX(-50%);
        color: white;
        padding: 0.8rem 2rem;
        border-radius: 2rem;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-weight: 500;
        max-width: 90%;
        text-align: center;
        transition: opacity 0.4s ease;
        pointer-events: none;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}
