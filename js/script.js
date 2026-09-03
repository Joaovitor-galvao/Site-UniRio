// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// ============================================

// ===== ALTO CONTRASTE =====
function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    
    // Atualizar o botão
    const btn = document.getElementById('high-contrast');
    if (btn) {
        btn.textContent = isActive ? '🌙 Contraste Normal' : '☀️ Alto Contraste';
        btn.setAttribute('aria-pressed', isActive);
    }
    console.log('Alto contraste:', isActive ? 'ativado' : 'desativado');
}

// ===== AJUSTE DE FONTE =====
function ajustarFonte(tamanho) {
    const html = document.documentElement;
    const escalaAtual = parseFloat(html.style.getPropertyValue('--font-scale')) || 1;
    let novaEscala = escalaAtual + tamanho;
    novaEscala = Math.min(Math.max(novaEscala, 0.8), 1.8);
    html.style.setProperty('--font-scale', novaEscala);
    localStorage.setItem('votoConscienteFontSize', novaEscala);
    console.log('Fonte ajustada para:', novaEscala);
}

function resetarFonte() {
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    console.log('Fonte resetada para o padrão');
}

// ===== CARREGAR PREFERÊNCIAS =====
function carregarPreferencias() {
    // Alto contraste
    const highContrast = localStorage.getItem('votoConscienteHighContrast');
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('high-contrast');
        if (btn) {
            btn.textContent = '🌙 Contraste Normal';
            btn.setAttribute('aria-pressed', 'true');
        }
    }
    
    // Fonte
    const fontSize = localStorage.getItem('votoConscienteFontSize');
    if (fontSize) {
        const val = parseFloat(fontSize);
        if (!isNaN(val) && val >= 0.8 && val <= 1.8) {
            document.documentElement.style.setProperty('--font-scale', val);
        }
    }
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
    }
}

// ===== SKIP LINK =====
function initSkipLink() {
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
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Script carregado!');
    carregarPreferencias();
    initMenuMobile();
    initSkipLink();
});
