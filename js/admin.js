// ============================================
// ADMIN.JS — CON(S)CIÊNCIA POLÍTICA
// ============================================

console.log('🚀 Admin.js carregado!');

// Chave única do localStorage
const STORAGE_KEY = 'votoConscienteContent';
const SESSION_KEY = 'votoConscienteSession';

// ---------- LOGIN ----------
function checkAdminLogin() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) {
        // Se não tem login, volta pro index (não existe /admin/login/)
        alert('Você precisa fazer login para acessar o painel.');
        window.location.href = '../index.html';
        return;
    }
    try {
        const data = JSON.parse(session);
        if (data.username !== 'admin') {
            window.location.href = '../index.html';
        }
    } catch (e) {
        window.location.href = '../index.html';
    }
}

function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = '../index.html';
    }
}

// ---------- STATS ----------
function updateStats() {
    const content = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const el = document.getElementById('stat-edits');
    if (el) el.textContent = Object.keys(content).length;
}

// ---------- EDIÇÃO ----------
function editSection(sectionId) {
    const existing = document.getElementById('edit-modal');
    if (existing) existing.remove();

    const savedContent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    let currentContent = savedContent[sectionId] || getContentFromDOM(sectionId) || '';

    const configs = {
        'hero':         { title: '🎨 Editar Hero',         label: 'Texto do Hero (use <br> para quebras)', placeholder: 'Título e subtítulo...' },
        'apresentacao': { title: '📝 Editar Apresentação', label: 'Texto de apresentação',              placeholder: 'Digite o texto...' },
        'objetivos':    { title: '🎯 Editar Objetivos',    label: 'Lista (um por linha)',               placeholder: 'Objetivo 1\nObjetivo 2' },
        'equipe':       { title: '👥 Editar Equipe',       label: 'Membros (Nome - Cargo)',             placeholder: 'Ana Silva - Coordenadora' },
        'eventos':      { title: '📅 Editar Eventos',      label: 'Eventos (Nome - Data - Local)',      placeholder: 'Oficina - 15/04/2026 - UNIRIO' },
        'noticias':     { title: '📰 Editar Notícias',     label: 'Notícias (Título - Data - Descrição)', placeholder: 'Lançamento - 01/03/2026 - Descrição' },
        'cards':        { title: '🃏 Editar Cards',        label: 'Cards (Título - Descrição - Link)',  placeholder: 'Eleições - Entenda - eleicoes-2026.html' },
        'footer':       { title: '📌 Editar Rodapé',       label: 'Texto do rodapé',                    placeholder: 'Digite...' },
        'candidatos':   { title: '🗳️ Editar Candidatos',   label: 'Candidatos (Nome - Partido - Número)', placeholder: 'Candidato A - PT - 13' }
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
            <div class="form-actions">
                <button class="btn btn--primary" onclick="saveEdit('${sectionId}')">💾 Salvar</button>
                <button class="btn btn-cancel" onclick="closeEditModal()">Cancelar</button>
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
            const p  = document.querySelector('.hero__subtitle');
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
    const savedContent = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    savedContent[sectionId] = content;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedContent));
    updateStats();
    showNotification('✅ Conteúdo salvo! Recarregue o site para ver.', 'success');
    closeEditModal();
}

function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) modal.remove();
}

function confirmReset() {
    if (confirm('⚠️ Restaurar o conteúdo padrão?')) {
        if (confirm('🔄 Confirme novamente: resetar tudo?')) {
            localStorage.removeItem(STORAGE_KEY);
            updateStats();
            showNotification('🔄 Conteúdo restaurado.', 'warning');
            setTimeout(() => location.reload(), 1500);
        }
    }
}

function showNotification(message, type = 'info') {
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    const colors = { success: '#27ae60', warning: '#f39c12', error: '#e74c3c', info: '#74402d' };
    const n = document.createElement('div');
    n.className = 'admin-notification';
    n.textContent = message;
    n.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        padding: 1rem 1.5rem; border-radius: 0.8rem; color: #fff;
        font-weight: 600; box-shadow: 0 8px 25px rgba(0,0,0,0.2);
        background: ${colors[type] || '#74402d'};
        transform: translateX(120%); transition: transform 0.3s ease;
    `;
    document.body.appendChild(n);
    setTimeout(() => n.style.transform = 'translateX(0)', 50);
    setTimeout(() => {
        n.style.transform = 'translateX(120%)';
        setTimeout(() => n.remove(), 300);
    }, 4000);
}

// ---------- LOGIN AUTOMÁTICO (DEV) ----------
// Se não existir página de login, cria uma sessão fake pra poder testar
function autoLoginDev() {
    if (!localStorage.getItem(SESSION_KEY)) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({
            username: 'admin',
            name: 'Administrador UNIRIO'
        }));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    autoLoginDev();       // remove isso quando tiver login real
    checkAdminLogin();
    updateStats();
});
