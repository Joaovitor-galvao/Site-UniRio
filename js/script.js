// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// ============================================

// ============================================
// ACESSIBILIDADE
// ============================================

let escalaFonteAtual = 1;
const FONTE_MIN = 0.8;
const FONTE_MAX = 1.8;

function ajustarFonte(delta) {
    const html = document.documentElement;
    let novaEscala = escalaFonteAtual + delta;
    if (delta === 0) { novaEscala = 1; }
    novaEscala = Math.min(Math.max(novaEscala, FONTE_MIN), FONTE_MAX);
    escalaFonteAtual = novaEscala;
    html.style.setProperty('--font-scale', novaEscala);
    localStorage.setItem('votoConscienteFontSize', novaEscala);
    atualizarIndicadoresFonte();
}

function atualizarIndicadoresFonte() {
    const btnInc = document.getElementById('btn-font-inc');
    const btnDec = document.getElementById('btn-font-dec');
    const btnReset = document.getElementById('btn-font-reset');
    if (btnInc) btnInc.classList.toggle('active', escalaFonteAtual > 1);
    if (btnDec) btnDec.classList.toggle('active', escalaFonteAtual < 1);
    if (btnReset) btnReset.classList.toggle('active', escalaFonteAtual === 1);
}

function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    const btn = document.getElementById('btn-contraste');
    if (btn) {
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
        btn.innerHTML = isActive ? '🌙<span class="indicador"></span>' : '☀️<span class="indicador"></span>';
    }
}

function toggleModoLeitura() {
    document.body.classList.toggle('modo-leitura');
    const isActive = document.body.classList.contains('modo-leitura');
    localStorage.setItem('votoConscienteModoLeitura', isActive ? 'true' : 'false');
    const btn = document.getElementById('btn-leitura');
    if (btn) {
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    }
}

function resetarAcessibilidade() {
    escalaFonteAtual = 1;
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    atualizarIndicadoresFonte();
    document.body.classList.remove('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', 'false');
    const btnContraste = document.getElementById('btn-contraste');
    if (btnContraste) {
        btnContraste.classList.remove('active');
        btnContraste.setAttribute('aria-pressed', 'false');
        btnContraste.innerHTML = '☀️<span class="indicador"></span>';
    }
    document.body.classList.remove('modo-leitura');
    localStorage.setItem('votoConscienteModoLeitura', 'false');
    const btnLeitura = document.getElementById('btn-leitura');
    if (btnLeitura) {
        btnLeitura.classList.remove('active');
        btnLeitura.setAttribute('aria-pressed', 'false');
    }
    mostrarNotificacaoAcessibilidade('♿ Configurações de acessibilidade redefinidas');
}

function carregarPreferenciasAcessibilidade() {
    const fontSize = localStorage.getItem('votoConscienteFontSize');
    if (fontSize) {
        const val = parseFloat(fontSize);
        if (!isNaN(val) && val >= FONTE_MIN && val <= FONTE_MAX) {
            escalaFonteAtual = val;
            document.documentElement.style.setProperty('--font-scale', val);
            atualizarIndicadoresFonte();
        }
    }
    const highContrast = localStorage.getItem('votoConscienteHighContrast');
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('btn-contraste');
        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            btn.innerHTML = '🌙<span class="indicador"></span>';
        }
    }
    const modoLeitura = localStorage.getItem('votoConscienteModoLeitura');
    if (modoLeitura === 'true') {
        document.body.classList.add('modo-leitura');
        const btn = document.getElementById('btn-leitura');
        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    }
}

function mostrarNotificacaoAcessibilidade(mensagem) {
    document.querySelectorAll('.notificacao-acessibilidade').forEach(el => el.remove());
    const notification = document.createElement('div');
    notification.className = 'notificacao-acessibilidade';
    notification.textContent = mensagem;
    notification.style.cssText = `
        position: fixed; bottom: 80px; left: 50%;
        transform: translateX(-50%);
        background: var(--cor-principal); color: var(--texto-claro);
        padding: 0.8rem 2rem; border-radius: 2rem; z-index: 99999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-family: var(--font-corpo); font-weight: 500;
        opacity: 0; transition: opacity 0.4s ease;
        max-width: 90%; text-align: center;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== MENU MOBILE =====
function initMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('primary-menu');
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            this.setAttribute('aria-expanded', expanded);
            navList.classList.toggle('open');
        });
        navList.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navList.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        const dropdownParents = navList.querySelectorAll('.has-dropdown > a');
        dropdownParents.forEach(function(parentLink) {
            parentLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const li = this.parentElement;
                    li.classList.toggle('open');
                }
            });
        });
    }
}

// ===== SKIP LINK =====
function criarSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = '♿ Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ============================================
// BARRA DE PESQUISA - ÍNDICE COMPLETO
// ============================================
const searchData = [
    { title: 'Início', url: 'index.html', category: 'Página inicial' },
    { title: 'Sobre o Projeto', url: 'sobre.html', category: 'Informações' },
    { title: 'Eventos', url: 'eventos.html', category: 'Eventos' },
    { title: 'Eleições 2026', url: 'eleicoes-2026.html', category: 'Eleições' },
    { title: 'Presidente', url: 'presidente.html', category: 'Cargos' },
    { title: 'Senador', url: 'senador.html', category: 'Cargos' },
    { title: 'Deputado Federal', url: 'deputado-federal.html', category: 'Cargos' },
    { title: 'Informações', url: 'informacoes.html', category: 'Dados' },
    { title: 'Quiz', url: 'quiz.html', category: 'Interativo' },
    { title: 'Simulador', url: 'simulador.html', category: 'Interativo' },
    { title: 'Você é o Senador', url: 'voce-e-o-senador.html', category: 'Jogo' },
    { title: 'Flashcards', url: 'flashcards.html', category: 'Interativo' },
    { title: 'Referências', url: 'referencias.html', category: 'Biblioteca' },
    { title: 'Contato', url: 'contato.html', category: 'Contato' },
    { title: 'Candidatos a Presidente', url: 'candidatos-presidente.html', category: 'Candidatos' },
    { title: 'Profª. Dra. Ana Carla Silva', url: 'ana-carla-silva.html', category: 'Equipe' },
    { title: 'Prof. Dr. João Mendes', url: 'joao-mendes.html', category: 'Equipe' },
    { title: 'Profª. Dra. Maria Oliveira', url: 'maria-oliveira.html', category: 'Equipe' },
    { title: 'Prof. Dr. Carlos Santos', url: 'carlos-santos.html', category: 'Equipe' },
    { title: 'Fernanda Lima', url: 'fernanda-lima.html', category: 'Equipe' },
    { title: 'Rafael Costa', url: 'rafael-costa.html', category: 'Equipe' },
    { title: 'Painel Administrativo', url: 'admin-panel.html', category: 'Admin' },
];

function buscar(query) {
    query = query.toLowerCase().trim();
    if (query.length === 0) return [];
    return searchData.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
}

function mostrarResultados(query) {
    const container = document.getElementById('search-results');
    if (!container) return;
    
    const results = buscar(query);
    container.innerHTML = '';
    
    if (results.length === 0) {
        container.innerHTML = `<div class="search-result-empty"><span>🔍</span><p>Nenhum resultado encontrado para "${query}"</p></div>`;
        container.style.display = 'block';
        return;
    }
    
    results.forEach(item => {
        const resultItem = document.createElement('a');
        resultItem.href = item.url;
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `<strong>${item.title}</strong><span class="category">${item.category}</span>`;
        container.appendChild(resultItem);
    });
    
    container.style.display = 'block';
}

function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const container = document.getElementById('search-results');
    if (!container) return;
    
    searchInput.addEventListener('input', function(e) {
        const query = this.value;
        if (query.length >= 2) {
            mostrarResultados(query);
        } else {
            container.style.display = 'none';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !container.contains(e.target)) {
            container.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            container.style.display = 'none';
            searchInput.blur();
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    carregarPreferenciasAcessibilidade();
    criarSkipLink();
    initMenuMobile();
    initSearch();
});
