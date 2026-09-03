// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// ============================================

console.log('🚀 Script carregado!');

// ===== ALTO CONTRASTE =====
function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    const btn = document.getElementById('high-contrast');
    if (btn) {
        btn.textContent = isActive ? '🌙 Contraste Normal' : '☀️ Alto Contraste';
    }
    console.log('Alto contraste:', isActive ? 'ativado' : 'desativado');
}

// ===== AJUSTE DE FONTE =====
function ajustarFonte(delta) {
    const html = document.documentElement;
    let escala = parseFloat(html.style.getPropertyValue('--font-scale')) || 1;
    escala = Math.min(Math.max(escala + delta, 0.8), 1.8);
    html.style.setProperty('--font-scale', escala);
    localStorage.setItem('votoConscienteFontSize', escala);
    console.log('Fonte:', escala);
}

function resetarFonte() {
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    console.log('Fonte resetada');
}

// ===== CARREGAR PREFERÊNCIAS =====
function carregarPreferencias() {
    const high = localStorage.getItem('votoConscienteHighContrast');
    if (high === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('high-contrast');
        if (btn) btn.textContent = '🌙 Contraste Normal';
    }
    const size = localStorage.getItem('votoConscienteFontSize');
    if (size) {
        const val = parseFloat(size);
        if (val >= 0.8 && val <= 1.8) {
            document.documentElement.style.setProperty('--font-scale', val);
        }
    }
}

// ===== MENU MOBILE =====
function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const list = document.getElementById('primary-menu');
    if (toggle && list) {
        toggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            this.setAttribute('aria-expanded', expanded);
            list.classList.toggle('open');
        });
        list.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    list.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    carregarPreferencias();
    initMenu();
    console.log('✅ Site inicializado!');
});
EOFcat > js/script.js << 'EOF'
// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// ============================================

console.log('🚀 Script carregado!');

// ===== ALTO CONTRASTE =====
function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    const btn = document.getElementById('high-contrast');
    if (btn) {
        btn.textContent = isActive ? '🌙 Contraste Normal' : '☀️ Alto Contraste';
    }
    console.log('Alto contraste:', isActive ? 'ativado' : 'desativado');
}

// ===== AJUSTE DE FONTE =====
function ajustarFonte(delta) {
    const html = document.documentElement;
    let escala = parseFloat(html.style.getPropertyValue('--font-scale')) || 1;
    escala = Math.min(Math.max(escala + delta, 0.8), 1.8);
    html.style.setProperty('--font-scale', escala);
    localStorage.setItem('votoConscienteFontSize', escala);
    console.log('Fonte:', escala);
}

function resetarFonte() {
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    console.log('Fonte resetada');
}

// ===== CARREGAR PREFERÊNCIAS =====
function carregarPreferencias() {
    const high = localStorage.getItem('votoConscienteHighContrast');
    if (high === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('high-contrast');
        if (btn) btn.textContent = '🌙 Contraste Normal';
    }
    const size = localStorage.getItem('votoConscienteFontSize');
    if (size) {
        const val = parseFloat(size);
        if (val >= 0.8 && val <= 1.8) {
            document.documentElement.style.setProperty('--font-scale', val);
        }
    }
}

// ===== MENU MOBILE =====
function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const list = document.getElementById('primary-menu');
    if (toggle && list) {
        toggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            this.setAttribute('aria-expanded', expanded);
            list.classList.toggle('open');
        });
        list.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    list.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    carregarPreferencias();
    initMenu();
    console.log('✅ Site inicializado!');
});
EOFddfdf



cat > js/script.js << 'EOF'
// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// ============================================

console.log('🚀 Script carregado!');

// ===== ALTO CONTRASTE =====
function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    const btn = document.getElementById('high-contrast');
    if (btn) {
        btn.textContent = isActive ? '🌙 Contraste Normal' : '☀️ Alto Contraste';
    }
    console.log('Alto contraste:', isActive ? 'ativado' : 'desativado');
}

// ===== AJUSTE DE FONTE =====
function ajustarFonte(delta) {
    const html = document.documentElement;
    let escala = parseFloat(html.style.getPropertyValue('--font-scale')) || 1;
    escala = Math.min(Math.max(escala + delta, 0.8), 1.8);
    html.style.setProperty('--font-scale', escala);
    localStorage.setItem('votoConscienteFontSize', escala);
    console.log('Fonte:', escala);
}

function resetarFonte() {
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    console.log('Fonte resetada');
}

// ===== CARREGAR PREFERÊNCIAS =====
function carregarPreferencias() {
    const high = localStorage.getItem('votoConscienteHighContrast');
    if (high === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('high-contrast');
        if (btn) btn.textContent = '🌙 Contraste Normal';
    }
    const size = localStorage.getItem('votoConscienteFontSize');
    if (size) {
        const val = parseFloat(size);
        if (val >= 0.8 && val <= 1.8) {
            document.documentElement.style.setProperty('--font-scale', val);
        }
    }
}

// ===== MENU MOBILE =====
function initMenu() {
    const toggle = document.getElementById('menu-toggle');
    const list = document.getElementById('primary-menu');
    if (toggle && list) {
        toggle.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
            this.setAttribute('aria-expanded', expanded);
            list.classList.toggle('open');
        });
        list.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    list.classList.remove('open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', function() {
    carregarPreferencias();
    initMenu();
    console.log('✅ Site inicializado!');
});
