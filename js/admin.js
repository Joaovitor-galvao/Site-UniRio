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

// ============================================
// INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    checkSession();
    addAdminButton();
    initInteractiveButtons();
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
            openAdminPanel();
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
        
        localStorage.setItem('votoConscienteSession', JSON.stringify(currentUser));
        
        const btn = document.getElementById('admin-toggle');
        if (btn) {
            btn.innerHTML = '👑';
            btn.title = 'Abrir painel';
        }
        
        closeModal('login-modal');
        mostrarNotificacaoAcessibilidade('✅ Bem-vindo, ' + MASTER_USER.name + '! Modo de edição ativado.');
        
        enableEditing();
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
    mostrarNotificacaoAcessibilidade('🔓 Logout realizado com sucesso.');
}

// ============================================
// PAINEL ADMIN - REDIRECIONA
// ============================================
function openAdminPanel() {
    window.location.href = 'admin-panel.html';
}

// ============================================
// ATIVAR EDIÇÃO
// ============================================
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

// ============================================
// BOTÕES INTERATIVOS
// ============================================
function initInteractiveButtons() {
    // Botão "Saiba Mais"
    const saibaMaisBtn = document.querySelector('.hero .btn--primary');
    if (saibaMaisBtn) {
        saibaMaisBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'sobre.html';
        });
    }
    
    // Cards de destaque
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
    
    // Links do menu
    document.querySelectorAll('.nav-list a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.endsWith('.html')) {
            if (!href.includes('.')) {
                link.setAttribute('href', href + '.html');
            }
        }
    });
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

function mostrarNotificacaoAcessibilidade(message) {
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}