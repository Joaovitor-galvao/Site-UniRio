// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// UNIRIO - 2026
// ============================================

// ============================================
// ACESSIBILIDADE - SISTEMA ATIVÁVEL
// ============================================

let escalaFonteAtual = 1;
const FONTE_MIN = 0.8;
const FONTE_MAX = 1.8;

// ===== 1. AJUSTAR FONTE =====
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

// ===== 2. ALTO CONTRASTE =====
function toggleAltoContraste() {
    const body = document.body;
    body.classList.toggle('high-contrast');
    const isActive = body.classList.contains('high-contrast');
    
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    
    const btn = document.getElementById('btn-contraste');
    if (btn) {
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
        btn.innerHTML = isActive ? '🌙<span class="indicador"></span>' : '☀️<span class="indicador"></span>';
        btn.title = isActive ? 'Desativar alto contraste' : 'Ativar alto contraste';
    }
}

// ===== 3. MODO LEITURA =====
function toggleModoLeitura() {
    const body = document.body;
    body.classList.toggle('modo-leitura');
    const isActive = body.classList.contains('modo-leitura');
    
    localStorage.setItem('votoConscienteModoLeitura', isActive ? 'true' : 'false');
    
    const btn = document.getElementById('btn-leitura');
    if (btn) {
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
        btn.title = isActive ? 'Desativar modo leitura' : 'Ativar modo leitura';
    }
}

// ===== 4. RESETAR ACESSIBILIDADE =====
function resetarAcessibilidade() {
    // Resetar fonte
    escalaFonteAtual = 1;
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    atualizarIndicadoresFonte();
    
    // Resetar alto contraste
    document.body.classList.remove('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', 'false');
    const btnContraste = document.getElementById('btn-contraste');
    if (btnContraste) {
        btnContraste.classList.remove('active');
        btnContraste.setAttribute('aria-pressed', 'false');
        btnContraste.innerHTML = '☀️<span class="indicador"></span>';
        btnContraste.title = 'Ativar alto contraste';
    }
    
    // Resetar modo leitura
    document.body.classList.remove('modo-leitura');
    localStorage.setItem('votoConscienteModoLeitura', 'false');
    const btnLeitura = document.getElementById('btn-leitura');
    if (btnLeitura) {
        btnLeitura.classList.remove('active');
        btnLeitura.setAttribute('aria-pressed', 'false');
        btnLeitura.title = 'Ativar modo leitura';
    }
    
    mostrarNotificacaoAcessibilidade('♿ Configurações de acessibilidade redefinidas');
}

// ===== 5. CARREGAR PREFERÊNCIAS =====
function carregarPreferenciasAcessibilidade() {
    // Fonte
    const fontSize = localStorage.getItem('votoConscienteFontSize');
    if (fontSize) {
        const val = parseFloat(fontSize);
        if (!isNaN(val) && val >= FONTE_MIN && val <= FONTE_MAX) {
            escalaFonteAtual = val;
            document.documentElement.style.setProperty('--font-scale', val);
            atualizarIndicadoresFonte();
        }
    }
    
    // Alto contraste
    const highContrast = localStorage.getItem('votoConscienteHighContrast');
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('btn-contraste');
        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            btn.innerHTML = '🌙<span class="indicador"></span>';
            btn.title = 'Desativar alto contraste';
        }
    }
    
    // Modo leitura
    const modoLeitura = localStorage.getItem('votoConscienteModoLeitura');
    if (modoLeitura === 'true') {
        document.body.classList.add('modo-leitura');
        const btn = document.getElementById('btn-leitura');
        if (btn) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
            btn.title = 'Desativar modo leitura';
        }
    }
}

// ===== 6. NOTIFICAÇÃO =====
function mostrarNotificacaoAcessibilidade(mensagem) {
    document.querySelectorAll('.notificacao-acessibilidade').forEach(el => el.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notificacao-acessibilidade';
    notification.textContent = mensagem;
    notification.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--cor-principal);
        color: var(--texto-claro);
        padding: 0.8rem 2rem;
        border-radius: 2rem;
        z-index: 99999;
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        font-family: var(--font-corpo);
        font-weight: 500;
        opacity: 0;
        transition: opacity 0.4s ease;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.opacity = '1', 100);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== 7. ATALHOS DO TECLADO =====
document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + C = Alto Contraste
    if (e.ctrlKey && e.shiftKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        toggleAltoContraste();
    }
    // Ctrl + Shift + L = Modo Leitura
    if (e.ctrlKey && e.shiftKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        toggleModoLeitura();
    }
    // Ctrl + Shift + R = Resetar
    if (e.ctrlKey && e.shiftKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        resetarAcessibilidade();
    }
});

// ===== 8. SKIP LINK =====
function criarSkipLink() {
    // Verificar se já existe
    if (document.querySelector('.skip-link')) return;
    
    const skipLink = document.createElement('a');
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = '♿ Pular para o conteúdo principal';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// ===== 9. MENU MOBILE =====
function initMenuMobile() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('primary-menu');
    
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            this.setAttribute('aria-expanded', expanded);
            navList.classList.toggle('open');
        });
        
        // Fechar menu ao clicar em um link (mobile)
        navList.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    navList.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
        
        // Dropdown mobile
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

// ===== 10. INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    carregarPreferenciasAcessibilidade();
    criarSkipLink();
    initMenuMobile();
    
    // Fechar menu com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navList = document.getElementById('primary-menu');
            const menuToggle = document.getElementById('menu-toggle');
            if (navList && navList.classList.contains('open')) {
                navList.classList.remove('open');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });
});

console.log('✅ CON(S)CIÊNCIA POLÍTICA - Site carregado com sucesso!');
console.log('♿ Atalhos: Ctrl+Shift+C = Alto Contraste | Ctrl+Shift+L = Modo Leitura | Ctrl+Shift+R = Resetar');