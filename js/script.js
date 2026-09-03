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
    const btn = document.getElementById('high-contrast');
    if (btn) {
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-pressed', isActive);
    }
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
        const btn = document.getElementById('high-contrast');
        if (btn) btn.classList.add('active');
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
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (navList && navList.classList.contains('open')) {
                navList.classList.remove('open');
                if (menuToggle) { menuToggle.setAttribute('aria-expanded', 'false'); }
            }
        }
    });
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const main = document.getElementById('main-content');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
                main.addEventListener('blur', function() {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }
    console.log('✅ Site carregado!');
};
