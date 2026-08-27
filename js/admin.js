// ============================================
// ADMIN - SISTEMA DE ADMINISTRAÇÃO
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
    if (isAuthenticated) { enableEditing(); }
});

function checkSession() {
    const session = localStorage.getItem('votoConscienteSession');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (data.username === MASTER_USER.username) {
                isAuthenticated = true;
                currentUser = data;
            }
        } catch(e) { localStorage.removeItem('votoConscienteSession'); }
    }
}

function addAdminButton() {
    if (document.getElementById('admin-toggle')) return;
    const adminBtn = document.createElement('div');
    adminBtn.id = 'admin-toggle';
    adminBtn.className = 'admin-float-btn';
    adminBtn.innerHTML = isAuthenticated ? '👑' : '🔐';
    adminBtn.addEventListener('click', function() {
        if (isAuthenticated) { openAdminPanel(); } 
        else { openLoginModal(); }
    });
    document.body.appendChild(adminBtn);
}

function openLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'login-modal';
    modal.innerHTML = `
        <div class="modal-content" role="dialog">
            <button class="modal-close" onclick="closeModal('login-modal')">✕</button>
            <h2>🔐 Acesso Administrativo</h2>
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
        if (btn) { btn.innerHTML = '👑'; }
        closeModal('login-modal');
        enableEditing();
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
    if (btn) { btn.innerHTML = '🔐'; }
    disableEditing();
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
            if (id) { editSection(id); }
        });
    });
}

function disableEditing() {
    document.querySelectorAll('.editable').forEach(el => {
        el.classList.remove('editable');
    });
}

function editSection(sectionId) {
    alert('Editar seção: ' + sectionId + '\nFuncionalidade em desenvolvimento.');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) { modal.remove(); }
}