// ============================================
// SISTEMA DE ADMINISTRAÇÃO - VOTO CONSCIENTE
// Usuário Master: pode editar conteúdo do site
// ============================================

// Configuração do usuário master
const MASTER_USER = {
    username: 'admin',
    password: 'unirio2026',
    name: 'Administrador UNIRIO'
};

// Estado de autenticação
let isAuthenticated = false;
let currentUser = null;

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se já está logado (sessão)
    checkSession();
    
    // Adicionar botão de admin no canto (se não existir)
    addAdminButton();
    
    // Inicializar todos os botões interativos
    initInteractiveButtons();
    
    // Inicializar sistema de edição (se logado)
    if (isAuthenticated) {
        enableEditing();
    }
});

// ============================================
// SESSÃO
// ============================================
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

// ============================================
// BOTÃO DE ADMIN
// ============================================
function addAdminButton() {
    if (document.getElementById('admin-toggle')) return;
    
    const adminBtn = document.createElement('div');
    adminBtn.id = 'admin-toggle';
    adminBtn.className = 'admin-float-btn';
    adminBtn.innerHTML = isAuthenticated ? '👑' : '🔐';
    adminBtn.setAttribute('aria-label', isAuthenticated ? 'Painel Administrativo' : 'Login');
    adminBtn.title = isAuthenticated ? 'Abrir painel' : 'Fazer login';
    
    adminBtn.addEventListener('click', function() {
        if (isAuthenticated) {
            openAdminPanel(); // Agora redireciona para admin-panel.html
        } else {
            openLoginModal();
        }
    });
    
    document.body.appendChild(adminBtn);
}
// ============================================
// MODAL DE LOGIN
// ============================================
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

// ============================================
// HANDLE LOGIN
// ============================================
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('login-user').value;
    const password = document.getElementById('login-pass').value;
    
    if (username === MASTER_USER.username && password === MASTER_USER.password) {
        isAuthenticated = true;
        currentUser = { username, name: MASTER_USER.name };
        
        // Salvar sessão
        localStorage.setItem('votoConscienteSession', JSON.stringify(currentUser));
        
        // Atualizar botão
        const btn = document.getElementById('admin-toggle');
        if (btn) {
            btn.innerHTML = '👑';
            btn.title = 'Abrir painel';
        }
        
        closeModal('login-modal');
        
        // Mostrar notificação
        showNotification('✅ Bem-vindo, ' + MASTER_USER.name + '! Modo de edição ativado.');
        
        // Ativar edição
        enableEditing();
        
        // Abrir painel
        setTimeout(() => openAdminPanel(), 500);
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    isAuthenticated = false;
    currentUser = null;
    localStorage.removeItem('votoConscienteSession');
    
    const btn = document.getElementById('admin-toggle');
    if (btn) {
        btn.innerHTML = '🔐';
        btn.title = 'Fazer login';
    }
    
    disableEditing();
    showNotification('🔓 Logout realizado com sucesso.');
    closeModal('admin-panel');
}

// ============================================
// PAINEL ADMINISTRATIVO
// ============================================
function openAdminPanel() {
    // Redirecionar para a página administrativa dedicada
    window.location.href = 'admin-panel.html';
}

// ============================================
// EDITAR SEÇÃO
// ============================================
function editSection(sectionId) {
    closeModal('admin-panel');
    
    // Encontrar a seção no DOM
    let element = null;
    let currentContent = '';
    let fieldType = 'textarea';
    let label = 'Conteúdo';
    
    switch(sectionId) {
        case 'hero':
            element = document.querySelector('.hero__title, .hero__subtitle');
            if (element) {
                currentContent = element.textContent.trim();
                label = 'Texto do Hero (use <br> para quebras de linha)';
            }
            break;
        case 'apresentacao':
            element = document.querySelector('.section:first-of-type .grid-2 p');
            if (element) {
                currentContent = element.textContent.trim();
                label = 'Texto de apresentação';
            }
            break;
        case 'objetivos':
            element = document.querySelector('.section:first-of-type .grid-2 ul');
            if (element) {
                currentContent = Array.from(element.querySelectorAll('li'))
                    .map(li => li.textContent.trim())
                    .join('\n');
                label = 'Lista de objetivos (um por linha)';
            }
            break;
        case 'equipe':
            element = document.querySelector('.section--team .grid-3');
            if (element) {
                currentContent = 'Gerenciar equipe no painel de administração.';
                fieldType = 'info';
                label = 'Use o painel para adicionar/remover membros.';
            }
            break;
        default:
            showNotification('⚠️ Seção não encontrada.');
            return;
    }
    
    // Criar modal de edição
    const editModal = document.createElement('div');
    editModal.className = 'modal-overlay';
    editModal.id = 'edit-modal';
    
    editModal.innerHTML = `
        <div class="modal-content" role="dialog" aria-labelledby="edit-title">
            <button class="modal-close" onclick="closeModal('edit-modal')" aria-label="Fechar">✕</button>
            <h2 id="edit-title">✏️ Editar: ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</h2>
            
            ${fieldType === 'info' ? `
                <p>${currentContent}</p>
                <button class="btn btn--primary" onclick="closeModal('edit-modal'); openAdminPanel();">Voltar ao Painel</button>
            ` : `
                <div class="form-group">
                    <label for="edit-content">${label}</label>
                    ${fieldType === 'textarea' ? 
                        `<textarea id="edit-content" rows="8">${currentContent}</textarea>` :
                        `<input type="text" id="edit-content" value="${currentContent}">`
                    }
                </div>
                <div style="display:flex; gap:1rem;">
                    <button class="btn btn--primary" onclick="saveContent('${sectionId}')">💾 Salvar</button>
                    <button class="btn" onclick="closeModal('edit-modal')" style="background:#ccc;">Cancelar</button>
                </div>
            `}
        </div>
    `;
    
    document.body.appendChild(editModal);
    
    // Focar no input
    if (document.getElementById('edit-content')) {
        document.getElementById('edit-content').focus();
    }
}

// ============================================
// SALVAR CONTEÚDO
// ============================================
function saveContent(sectionId) {
    const content = document.getElementById('edit-content').value;
    
    // Salvar no localStorage
    const savedContent = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    savedContent[sectionId] = content;
    localStorage.setItem('votoConscienteContent', JSON.stringify(savedContent));
    
    // Atualizar DOM
    switch(sectionId) {
        case 'hero':
            const heroTitle = document.querySelector('.hero__title');
            const heroSub = document.querySelector('.hero__subtitle');
            if (heroTitle) {
                const lines = content.split('\n');
                heroTitle.innerHTML = lines[0] || heroTitle.innerHTML;
            }
            break;
        case 'apresentacao':
            const p = document.querySelector('.section:first-of-type .grid-2 p');
            if (p) {
                p.textContent = content;
            }
            break;
        case 'objetivos':
            const ul = document.querySelector('.section:first-of-type .grid-2 ul');
            if (ul) {
                const items = content.split('\n').filter(line => line.trim());
                ul.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
            }
            break;
    }
    
    closeModal('edit-modal');
    showNotification('✅ Conteúdo salvo com sucesso!');
}

// ============================================
// RESETAR CONTEÚDO
// ============================================
function confirmReset() {
    if (confirm('⚠️ Tem certeza que deseja restaurar o conteúdo padrão? Esta ação não pode ser desfeita.')) {
        if (confirm('🔄 Confirme novamente: deseja resetar todo o conteúdo personalizado?')) {
            localStorage.removeItem('votoConscienteContent');
            showNotification('🔄 Conteúdo restaurado para o padrão. Recarregue a página.');
            setTimeout(() => location.reload(), 2000);
        }
    }
}

// ============================================
// FUNÇÕES DE UTILIDADE
// ============================================
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.remove();
    }
}

function showNotification(message) {
    // Remover notificações antigas
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animação de entrada
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remover após 4 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// ATIVAR EDIÇÃO
// ============================================
function enableEditing() {
    document.querySelectorAll('.section, .hero, .card').forEach(el => {
        el.classList.add('editable');
        el.addEventListener('dblclick', function(e) {
            // Tentar encontrar o ID da seção
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

// ============================================
// BOTÕES INTERATIVOS
// ============================================
function initInteractiveButtons() {
    // Botão "Saiba Mais" - redirecionar para Sobre
    const saibaMaisBtn = document.querySelector('.hero .btn--primary');
    if (saibaMaisBtn) {
        saibaMaisBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'sobre.html';
        });
    }
    
    // Cards de destaque - redirecionar
    document.querySelectorAll('.card--link').forEach(card => {
        card.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#')) {
                // Deixar o link funcionar normalmente
                return;
            }
            e.preventDefault();
            // Fallback
            const title = this.querySelector('h3')?.textContent || 'Página';
            showNotification(`🔜 Página "${title}" em desenvolvimento`);
        });
    });
    
    // Links do menu - verificar se existem
    document.querySelectorAll('.nav-list a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.endsWith('.html')) {
            // Adicionar .html se necessário
            if (!href.includes('.')) {
                link.setAttribute('href', href + '.html');
            }
        }
    });
}

// ============================================
// INICIALIZAR COM CONTEÚDO SALVO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const savedContent = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    
    // Aplicar conteúdo salvo
    if (savedContent.hero) {
        const heroTitle = document.querySelector('.hero__title');
        if (heroTitle) {
            heroTitle.innerHTML = savedContent.hero.split('\n')[0] || heroTitle.innerHTML;
        }
    }
    
    if (savedContent.apresentacao) {
        const p = document.querySelector('.section:first-of-type .grid-2 p');
        if (p) {
            p.textContent = savedContent.apresentacao;
        }
    }
    
    if (savedContent.objetivos) {
        const ul = document.querySelector('.section:first-of-type .grid-2 ul');
        if (ul) {
            const items = savedContent.objetivos.split('\n').filter(line => line.trim());
            ul.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
        }
    }
});