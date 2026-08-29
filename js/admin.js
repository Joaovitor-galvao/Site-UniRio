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
        addEditButtons();
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
        addEditButtons();
        renderizarSenadores();
        renderizarDeputados();
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
    removeEditButtons();
    renderizarSenadores();
    renderizarDeputados();
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
// BOTÕES DE EDIÇÃO RÁPIDA
// ============================================
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

// ============================================
// EDITAR SEÇÃO - FUNÇÃO COMPLETA
// ============================================
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

// ============================================
// BOTÕES INTERATIVOS
// ============================================
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

// ============================================
// FUNÇÕES DE UTILIDADE
// ============================================
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
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => { notification.classList.remove('show'); setTimeout(() => notification.remove(), 300); }, 4000);
}
// ============================================
// NOTIFICAÇÕES ESTILIZADAS
// ============================================
function mostrarNotificacaoAcessibilidade(message, type = 'info') {
    document.querySelectorAll('.admin-notification').forEach(el => el.remove());
    const colors = { success: '#27ae60', warning: '#f39c12', error: '#e74c3c', info: 'var(--cor-destaque)' };
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    notification.style.background = colors[type] || 'var(--cor-principal)';
    notification.style.position = 'fixed';
    notification.style.bottom = '100px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.color = '#fff';
    notification.style.padding = '0.8rem 2rem';
    notification.style.borderRadius = '2rem';
    notification.style.zIndex = '99999';
    notification.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    notification.style.fontWeight = '500';
    notification.style.maxWidth = '90%';
    notification.style.textAlign = 'center';
    notification.style.transition = 'opacity 0.4s ease';
    notification.style.pointerEvents = 'none';
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 4000);
}
// ==========================================================
// CANDIDATOS AO SENADO - EDIÇÃO PELO PAINEL ADMINISTRATIVO
// Cole este bloco NO FINAL do seu admin.js
// ==========================================================

const SENADORES_STORAGE_KEY = 'votoConscienteSenadoresRJ2026';

const SENADORES_PADRAO = [
    { nome: 'André Monteiro', partido: 'Democrata', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' },
    { nome: 'Benedita da Silva', partido: 'PT', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' },
    { nome: 'Carlos Jordy', partido: 'PL', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' },
    { nome: 'Carlos Portinho', partido: 'PL', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' },
    { nome: 'Marcelo Crivella', partido: 'Republicanos', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' },
    { nome: 'Monica Benicio', partido: 'PSOL', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' },
    { nome: 'Pedro Paulo', partido: 'PSD', nomeCompleto: '', profissao: '', naturalidade: '', experiencia: [], primeiroSuplente: '', segundoSuplente: '' }
];

function escaparHTML(valor = '') {
    return String(valor)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function obterSenadores() {
    const salvo = localStorage.getItem(SENADORES_STORAGE_KEY);

    if (!salvo) {
        localStorage.setItem(
            SENADORES_STORAGE_KEY,
            JSON.stringify(SENADORES_PADRAO)
        );

        return JSON.parse(JSON.stringify(SENADORES_PADRAO));
    }

    try {
        const dados = JSON.parse(salvo);

        return Array.isArray(dados) ? dados : [];
    } catch (e) {
        console.error('Erro ao carregar candidatos:', e);
        return [];
    }
}

function salvarSenadores(lista) {
    localStorage.setItem(
        SENADORES_STORAGE_KEY,
        JSON.stringify(lista)
    );
}

function renderizarSenadores() {
    const container = document.getElementById('lista-candidatos');

    if (!container) return;

    const candidatos = obterSenadores();

    container.innerHTML = '';

    if (candidatos.length === 0) {
        container.innerHTML = `
            <div class="candidato-vazio">
                <h3>Nenhum candidato cadastrado.</h3>
                <p>Entre como administrador para adicionar candidatos.</p>
            </div>
        `;

        atualizarBarraAdminCandidatos();
        return;
    }

    candidatos.forEach((candidato, index) => {

        const experiencia = Array.isArray(candidato.experiencia)
            ? candidato.experiencia
            : String(candidato.experiencia || '')
                .split('\n')
                .map(item => item.trim())
                .filter(Boolean);

        const card = document.createElement('div');

        card.className = 'candidato-card';

        card.innerHTML = `
            ${
                candidato.partido
                    ? `<span class="partido-badge">${escaparHTML(candidato.partido)}</span>`
                    : ''
            }

            <h3>${escaparHTML(candidato.nome || 'Candidato sem nome')}</h3>

            ${
                candidato.nomeCompleto
                    ? `<p class="nome-completo">${escaparHTML(candidato.nomeCompleto)}</p>`
                    : ''
            }

            ${
                candidato.profissao
                    ? `<p class="info-secundaria">
                        <strong>Profissão:</strong>
                        ${escaparHTML(candidato.profissao)}
                    </p>`
                    : ''
            }

            ${
                candidato.naturalidade
                    ? `<p class="info-secundaria">
                        <strong>Naturalidade:</strong>
                        ${escaparHTML(candidato.naturalidade)}
                    </p>`
                    : ''
            }

            ${
                experiencia.length
                    ? `
                    <div class="detalhes">
                        <strong>📋 Experiência política:</strong>

                        <ul>
                            ${
                                experiencia
                                    .map(item => `<li>${escaparHTML(item)}</li>`)
                                    .join('')
                            }
                        </ul>
                    </div>
                    `
                    : ''
            }

            ${
                candidato.primeiroSuplente || candidato.segundoSuplente
                    ? `
                    <div class="suplentes">
                        <strong>👥 Suplentes:</strong><br>

                        ${
                            candidato.primeiroSuplente
                                ? `1º ${escaparHTML(candidato.primeiroSuplente)}<br>`
                                : ''
                        }

                        ${
                            candidato.segundoSuplente
                                ? `2º ${escaparHTML(candidato.segundoSuplente)}`
                                : ''
                        }
                    </div>
                    `
                    : ''
            }

            ${
                isAuthenticated
                    ? `
                    <div class="candidato-admin-actions">
                        <button
                            class="btn-editar-candidato"
                            onclick="abrirModalCandidato(${index})"
                        >
                            ✏️ Editar
                        </button>

                        <button
                            class="btn-excluir-candidato"
                            onclick="excluirCandidato(${index})"
                        >
                            🗑️ Excluir
                        </button>
                    </div>
                    `
                    : ''
            }
        `;

        container.appendChild(card);
    });

    atualizarBarraAdminCandidatos();
}

function atualizarBarraAdminCandidatos() {
    const barra = document.getElementById('admin-candidatos-bar');

    if (!barra) return;

    barra.classList.toggle('ativo', isAuthenticated);
}

function abrirModalCandidato(index = null) {
    if (!isAuthenticated) {
        mostrarNotificacaoAcessibilidade(
            '🔐 Faça login como administrador para editar candidatos.',
            'warning'
        );

        return;
    }

    const lista = obterSenadores();

    const candidato = index === null
        ? {
            nome: '',
            partido: '',
            nomeCompleto: '',
            profissao: '',
            naturalidade: '',
            experiencia: [],
            primeiroSuplente: '',
            segundoSuplente: ''
        }
        : lista[index];

    if (!candidato) return;

    const existente = document.getElementById('candidate-modal');

    if (existente) existente.remove();

    const experienciaTexto = Array.isArray(candidato.experiencia)
        ? candidato.experiencia.join('\n')
        : candidato.experiencia || '';

    const modal = document.createElement('div');

    modal.className = 'modal-overlay';
    modal.id = 'candidate-modal';

    modal.innerHTML = `
        <div
            class="modal-content edit-modal"
            role="dialog"
            aria-labelledby="candidate-modal-title"
        >

            <button
                class="modal-close"
                onclick="closeModal('candidate-modal')"
                aria-label="Fechar"
            >
                ✕
            </button>

            <h2 id="candidate-modal-title">
                ${
                    index === null
                        ? '➕ Adicionar candidato'
                        : '✏️ Editar candidato'
                }
            </h2>

            <form
                id="candidate-form"
                onsubmit="salvarCandidato(
                    event,
                    ${index === null ? 'null' : index}
                )"
            >

                <div class="form-group">
                    <label for="candidate-name">
                        Nome *
                    </label>

                    <input
                        id="candidate-name"
                        type="text"
                        value="${escaparHTML(candidato.nome)}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="candidate-party">
                        Partido *
                    </label>

                    <input
                        id="candidate-party"
                        type="text"
                        value="${escaparHTML(candidato.partido)}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="candidate-full-name">
                        Nome completo
                    </label>

                    <input
                        id="candidate-full-name"
                        type="text"
                        value="${escaparHTML(candidato.nomeCompleto || '')}"
                    >
                </div>

                <div class="form-group">
                    <label for="candidate-profession">
                        Profissão
                    </label>

                    <input
                        id="candidate-profession"
                        type="text"
                        value="${escaparHTML(candidato.profissao || '')}"
                    >
                </div>

                <div class="form-group">
                    <label for="candidate-birthplace">
                        Naturalidade
                    </label>

                    <input
                        id="candidate-birthplace"
                        type="text"
                        value="${escaparHTML(candidato.naturalidade || '')}"
                    >
                </div>

                <div class="form-group">
                    <label for="candidate-experience">
                        Experiência política
                        (uma por linha)
                    </label>

                    <textarea id="candidate-experience">${escaparHTML(experienciaTexto)}</textarea>
                </div>

                <div class="form-group">
                    <label for="candidate-first-substitute">
                        1º suplente
                    </label>

                    <input
                        id="candidate-first-substitute"
                        type="text"
                        value="${escaparHTML(candidato.primeiroSuplente || '')}"
                    >
                </div>

                <div class="form-group">
                    <label for="candidate-second-substitute">
                        2º suplente
                    </label>

                    <input
                        id="candidate-second-substitute"
                        type="text"
                        value="${escaparHTML(candidato.segundoSuplente || '')}"
                    >
                </div>

                <div
                    class="form-actions"
                    style="
                        display:flex;
                        gap:1rem;
                        margin-top:1rem;
                        flex-wrap:wrap;
                    "
                >

                    <button
                        type="submit"
                        class="btn btn--primary"
                    >
                        💾 Salvar candidato
                    </button>

                    <button
                        type="button"
                        class="btn btn-cancel"
                        onclick="closeModal('candidate-modal')"
                        style="
                            background:#e0d6c8;
                            color:var(--texto);
                            border:none;
                            padding:0.7rem 1.5rem;
                            border-radius:2rem;
                            cursor:pointer;
                        "
                    >
                        Cancelar
                    </button>

                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('candidate-name').focus();
}

function salvarCandidato(event, index) {
    event.preventDefault();

    if (!isAuthenticated) return;

    const lista = obterSenadores();

    const novoCandidato = {
        nome:
            document
                .getElementById('candidate-name')
                .value
                .trim(),

        partido:
            document
                .getElementById('candidate-party')
                .value
                .trim(),

        nomeCompleto:
            document
                .getElementById('candidate-full-name')
                .value
                .trim(),

        profissao:
            document
                .getElementById('candidate-profession')
                .value
                .trim(),

        naturalidade:
            document
                .getElementById('candidate-birthplace')
                .value
                .trim(),

        experiencia:
            document
                .getElementById('candidate-experience')
                .value
                .split('\n')
                .map(item => item.trim())
                .filter(Boolean),

        primeiroSuplente:
            document
                .getElementById('candidate-first-substitute')
                .value
                .trim(),

        segundoSuplente:
            document
                .getElementById('candidate-second-substitute')
                .value
                .trim()
    };

    if (index === null) {
        lista.push(novoCandidato);
    } else {
        lista[index] = novoCandidato;
    }

    salvarSenadores(lista);

    closeModal('candidate-modal');

    renderizarSenadores();

    mostrarNotificacaoAcessibilidade(
        '✅ Candidato salvo com sucesso!',
        'success'
    );
}

function excluirCandidato(index) {
    if (!isAuthenticated) return;

    const lista = obterSenadores();

    const candidato = lista[index];

    if (!candidato) return;

    const confirmar = confirm(
        `Excluir "${candidato.nome}" da lista?`
    );

    if (!confirmar) return;

    lista.splice(index, 1);

    salvarSenadores(lista);

    renderizarSenadores();

    mostrarNotificacaoAcessibilidade(
        '🗑️ Candidato excluído.',
        'warning'
    );
}

function restaurarSenadoresPadrao() {
    if (!isAuthenticated) return;

    const confirmar = confirm(
        'Restaurar a lista inicial de candidatos? As alterações atuais serão perdidas.'
    );

    if (!confirmar) return;

    salvarSenadores(
        JSON.parse(JSON.stringify(SENADORES_PADRAO))
    );

    renderizarSenadores();

    mostrarNotificacaoAcessibilidade(
        '↻ Lista inicial restaurada.',
        'success'
    );
}

document.addEventListener(
    'DOMContentLoaded',
    function() {
        renderizarSenadores();
    }
);

// ==========================================================
// DEPUTADOS FEDERAIS RJ 2026
// SISTEMA DE CADASTRO / EDIÇÃO
// ==========================================================

const DEPUTADOS_STORAGE_KEY =
    'votoConscienteDeputadosFederaisRJ2026';


// Diferente dos senadores:
// a lista começa VAZIA.

const DEPUTADOS_PADRAO = [];



/* ==========================================================
   CARREGAR
========================================================== */

function obterDeputados() {

    const salvo =
        localStorage.getItem(
            DEPUTADOS_STORAGE_KEY
        );


    if (!salvo) {

        localStorage.setItem(
            DEPUTADOS_STORAGE_KEY,
            JSON.stringify(DEPUTADOS_PADRAO)
        );

        return [];
    }


    try {

        const dados =
            JSON.parse(salvo);


        return Array.isArray(dados)
            ? dados
            : [];

    }

    catch (erro) {

        console.error(
            'Erro ao carregar deputados:',
            erro
        );

        return [];
    }
}



/* ==========================================================
   SALVAR
========================================================== */

function salvarDeputados(lista) {

    localStorage.setItem(

        DEPUTADOS_STORAGE_KEY,

        JSON.stringify(lista)

    );
}



/* ==========================================================
   RENDERIZAR
========================================================== */

function renderizarDeputados() {

    const container =
        document.getElementById(
            'lista-deputados'
        );


    // Estamos em outra página?
    // Então simplesmente não faz nada.

    if (!container) return;



    const deputados =
        obterDeputados();


    container.innerHTML = '';



    /* =========================
       NENHUM CADASTRADO
    ========================= */

    if (deputados.length === 0) {

        container.innerHTML = `

            <div class="candidato-vazio">

                <h3>
                    🗳️ Nenhum candidato adicionado
                </h3>

                <p>
                    Os candidatos apresentados nesta
                    seção serão adicionados pela equipe
                    responsável pelo projeto.
                </p>

                ${
                    isAuthenticated

                    ? `
                        <button
                            class="btn-admin-candidato"
                            onclick="abrirModalDeputado()"
                            style="margin-top:1rem;"
                        >
                            ➕ Adicionar primeiro candidato
                        </button>
                    `

                    : ''
                }

            </div>
        `;


        atualizarBarraAdminDeputados();

        return;
    }



    /* =========================
       CRIA OS CARDS
    ========================= */

    deputados.forEach(
        (deputado, index) => {


        const experiencia =

            Array.isArray(
                deputado.experiencia
            )

            ? deputado.experiencia

            : String(
                deputado.experiencia || ''
            )

            .split('\n')

            .map(
                item => item.trim()
            )

            .filter(Boolean);



        const propostas =

            Array.isArray(
                deputado.propostas
            )

            ? deputado.propostas

            : String(
                deputado.propostas || ''
            )

            .split('\n')

            .map(
                item => item.trim()
            )

            .filter(Boolean);



        const card =
            document.createElement(
                'div'
            );


        card.className =
            'candidato-card';



        card.innerHTML = `


            ${
                deputado.partido

                ? `
                    <span
                        class="partido-badge"
                    >
                        ${
                            escaparHTML(
                                deputado.partido
                            )
                        }
                    </span>
                `

                : ''
            }


            <h3>

                ${
                    escaparHTML(
                        deputado.nome ||
                        'Candidato sem nome'
                    )
                }

            </h3>



            ${
                deputado.nomeCompleto

                ? `
                    <p class="nome-completo">

                        ${
                            escaparHTML(
                                deputado.nomeCompleto
                            )
                        }

                    </p>
                `

                : ''
            }



            ${
                deputado.numero

                ? `
                    <p class="info-secundaria">

                        <strong>
                            🔢 Número:
                        </strong>

                        ${
                            escaparHTML(
                                deputado.numero
                            )
                        }

                    </p>
                `

                : ''
            }



            ${
                deputado.profissao

                ? `
                    <p class="info-secundaria">

                        <strong>
                            Profissão:
                        </strong>

                        ${
                            escaparHTML(
                                deputado.profissao
                            )
                        }

                    </p>
                `

                : ''
            }



            ${
                deputado.naturalidade

                ? `
                    <p class="info-secundaria">

                        <strong>
                            Naturalidade:
                        </strong>

                        ${
                            escaparHTML(
                                deputado.naturalidade
                            )
                        }

                    </p>
                `

                : ''
            }



            ${
                experiencia.length

                ? `

                    <div class="detalhes">

                        <strong>
                            📋 Experiência política:
                        </strong>

                        <ul>

                            ${
                                experiencia

                                .map(
                                    item =>
                                    `
                                    <li>
                                        ${
                                            escaparHTML(
                                                item
                                            )
                                        }
                                    </li>
                                    `
                                )

                                .join('')
                            }

                        </ul>

                    </div>

                `

                : ''
            }



            ${
                propostas.length

                ? `

                    <div class="propostas">

                        <strong>
                            💡 Principais propostas:
                        </strong>

                        <ul>

                            ${
                                propostas

                                .map(
                                    item =>
                                    `
                                    <li>
                                        ${
                                            escaparHTML(
                                                item
                                            )
                                        }
                                    </li>
                                    `
                                )

                                .join('')
                            }

                        </ul>

                    </div>

                `

                : ''
            }



            ${
                isAuthenticated

                ? `

                    <div
                        class="candidato-admin-actions"
                    >

                        <button

                            class="btn-editar-candidato"

                            onclick="
                                abrirModalDeputado(
                                    ${index}
                                )
                            "
                        >

                            ✏️ Editar

                        </button>


                        <button

                            class="btn-excluir-candidato"

                            onclick="
                                excluirDeputado(
                                    ${index}
                                )
                            "
                        >

                            🗑️ Excluir

                        </button>

                    </div>

                `

                : ''
            }

        `;


        container.appendChild(card);

    });



    atualizarBarraAdminDeputados();

}



/* ==========================================================
   MOSTRAR BARRA DO ADMIN
========================================================== */

function atualizarBarraAdminDeputados() {

    const barra =
        document.getElementById(
            'admin-deputados-bar'
        );


    if (!barra) return;


    barra.classList.toggle(
        'ativo',
        isAuthenticated
    );

}



/* ==========================================================
   ABRIR FORMULÁRIO
========================================================== */

function abrirModalDeputado(
    index = null
) {


    if (!isAuthenticated) {

        mostrarNotificacaoAcessibilidade(

            '🔐 Faça login como administrador para editar candidatos.',

            'warning'
        );


        return;
    }



    const lista =
        obterDeputados();



    const deputado =

        index === null

        ? {

            nome: '',

            partido: '',

            numero: '',

            nomeCompleto: '',

            profissao: '',

            naturalidade: '',

            experiencia: [],

            propostas: []

        }

        : lista[index];



    if (!deputado) return;



    const existente =
        document.getElementById(
            'deputado-modal'
        );


    if (existente) {
        existente.remove();
    }



    const experienciaTexto =

        Array.isArray(
            deputado.experiencia
        )

        ? deputado.experiencia.join('\n')

        : deputado.experiencia || '';



    const propostasTexto =

        Array.isArray(
            deputado.propostas
        )

        ? deputado.propostas.join('\n')

        : deputado.propostas || '';



    const modal =
        document.createElement(
            'div'
        );


    modal.className =
        'modal-overlay';


    modal.id =
        'deputado-modal';



    modal.innerHTML = `

        <div

            class="
                modal-content
                edit-modal
            "

            role="dialog"

            aria-labelledby="
                deputado-modal-title
            "
        >


            <button

                class="modal-close"

                onclick="
                    closeModal(
                        'deputado-modal'
                    )
                "

                aria-label="Fechar"
            >

                ✕

            </button>



            <h2
                id="deputado-modal-title"
            >

                ${
                    index === null

                    ? '➕ Adicionar Deputado Federal'

                    : '✏️ Editar Deputado Federal'
                }

            </h2>



            <form

                id="deputado-form"

                onsubmit="
                    salvarDeputado(
                        event,
                        ${
                            index === null
                            ? 'null'
                            : index
                        }
                    )
                "
            >


                <!-- NOME -->

                <div class="form-group">

                    <label
                        for="deputado-name"
                    >
                        Nome *
                    </label>


                    <input

                        id="deputado-name"

                        type="text"

                        value="${
                            escaparHTML(
                                deputado.nome
                            )
                        }"

                        required
                    >

                </div>



                <!-- PARTIDO -->

                <div class="form-group">

                    <label
                        for="deputado-party"
                    >
                        Partido *
                    </label>


                    <input

                        id="deputado-party"

                        type="text"

                        value="${
                            escaparHTML(
                                deputado.partido
                            )
                        }"

                        required
                    >

                </div>



                <!-- NÚMERO -->

                <div class="form-group">

                    <label
                        for="deputado-number"
                    >
                        Número
                    </label>


                    <input

                        id="deputado-number"

                        type="text"

                        placeholder="Ex.: 1234"

                        value="${
                            escaparHTML(
                                deputado.numero || ''
                            )
                        }"
                    >

                </div>



                <!-- NOME COMPLETO -->

                <div class="form-group">

                    <label
                        for="deputado-full-name"
                    >
                        Nome completo
                    </label>


                    <input

                        id="deputado-full-name"

                        type="text"

                        value="${
                            escaparHTML(
                                deputado.nomeCompleto || ''
                            )
                        }"
                    >

                </div>



                <!-- PROFISSÃO -->

                <div class="form-group">

                    <label
                        for="deputado-profession"
                    >
                        Profissão
                    </label>


                    <input

                        id="deputado-profession"

                        type="text"

                        value="${
                            escaparHTML(
                                deputado.profissao || ''
                            )
                        }"
                    >

                </div>



                <!-- NATURALIDADE -->

                <div class="form-group">

                    <label
                        for="deputado-birthplace"
                    >
                        Naturalidade
                    </label>


                    <input

                        id="deputado-birthplace"

                        type="text"

                        value="${
                            escaparHTML(
                                deputado.naturalidade || ''
                            )
                        }"
                    >

                </div>



                <!-- EXPERIÊNCIA -->

                <div class="form-group">

                    <label
                        for="deputado-experience"
                    >

                        Experiência política

                        <br>

                        <small>
                            Coloque uma por linha
                        </small>

                    </label>


                    <textarea
                        id="deputado-experience"
                    >${escaparHTML(
                        experienciaTexto
                    )}</textarea>

                </div>



                <!-- PROPOSTAS -->

                <div class="form-group">

                    <label
                        for="deputado-proposals"
                    >

                        Principais propostas

                        <br>

                        <small>
                            Coloque uma por linha
                        </small>

                    </label>


                    <textarea
                        id="deputado-proposals"
                    >${escaparHTML(
                        propostasTexto
                    )}</textarea>

                </div>



                <!-- BOTÕES -->

                <div

                    class="form-actions"

                    style="
                        display:flex;
                        gap:1rem;
                        margin-top:1rem;
                        flex-wrap:wrap;
                    "
                >


                    <button

                        type="submit"

                        class="
                            btn
                            btn--primary
                        "
                    >

                        💾 Salvar candidato

                    </button>



                    <button

                        type="button"

                        onclick="
                            closeModal(
                                'deputado-modal'
                            )
                        "

                        style="
                            background:#e0d6c8;
                            color:var(--texto);
                            border:none;
                            padding:0.7rem 1.5rem;
                            border-radius:2rem;
                            cursor:pointer;
                        "
                    >

                        Cancelar

                    </button>

                </div>


            </form>

        </div>

    `;



    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            'deputado-name'
        )
        .focus();

}



/* ==========================================================
   SALVAR CANDIDATO
========================================================== */

function salvarDeputado(
    event,
    index
) {

    event.preventDefault();


    if (!isAuthenticated) return;



    const lista =
        obterDeputados();



    const novoDeputado = {


        nome:

            document
            .getElementById(
                'deputado-name'
            )
            .value
            .trim(),



        partido:

            document
            .getElementById(
                'deputado-party'
            )
            .value
            .trim(),



        numero:

            document
            .getElementById(
                'deputado-number'
            )
            .value
            .trim(),



        nomeCompleto:

            document
            .getElementById(
                'deputado-full-name'
            )
            .value
            .trim(),



        profissao:

            document
            .getElementById(
                'deputado-profession'
            )
            .value
            .trim(),



        naturalidade:

            document
            .getElementById(
                'deputado-birthplace'
            )
            .value
            .trim(),



        experiencia:

            document
            .getElementById(
                'deputado-experience'
            )
            .value

            .split('\n')

            .map(
                item => item.trim()
            )

            .filter(Boolean),



        propostas:

            document
            .getElementById(
                'deputado-proposals'
            )
            .value

            .split('\n')

            .map(
                item => item.trim()
            )

            .filter(Boolean)

    };



    /* =========================
       NOVO OU EDITAR
    ========================= */

    if (index === null) {

        lista.push(
            novoDeputado
        );

    }

    else {

        lista[index] =
            novoDeputado;

    }



    salvarDeputados(
        lista
    );


    closeModal(
        'deputado-modal'
    );


    renderizarDeputados();


    mostrarNotificacaoAcessibilidade(

        '✅ Candidato salvo com sucesso!',

        'success'
    );

}



/* ==========================================================
   EXCLUIR
========================================================== */

function excluirDeputado(
    index
) {

    if (!isAuthenticated) {
        return;
    }



    const lista =
        obterDeputados();



    const deputado =
        lista[index];


    if (!deputado) return;



    const confirmar =
        confirm(

            `Excluir "${deputado.nome}" da lista?`

        );


    if (!confirmar) return;



    lista.splice(
        index,
        1
    );


    salvarDeputados(
        lista
    );


    renderizarDeputados();


    mostrarNotificacaoAcessibilidade(

        '🗑️ Candidato excluído.',

        'warning'
    );

}



/* ==========================================================
   LIMPAR TODOS
========================================================== */

function limparDeputados() {

    if (!isAuthenticated) {
        return;
    }



    const confirmar =
        confirm(

            'Deseja remover todos os candidatos cadastrados?'

        );


    if (!confirmar) return;



    salvarDeputados([]);


    renderizarDeputados();


    mostrarNotificacaoAcessibilidade(

        '🗑️ Lista de deputados limpa.',

        'warning'
    );

}



/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

document.addEventListener(

    'DOMContentLoaded',

    function() {

        renderizarDeputados();

    }

);