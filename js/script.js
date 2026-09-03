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

cat >> js/script.js << 'EOF'

// ============================================
// CARREGAR CONTEÚDO SALVO DO ADMIN
// ============================================
function carregarConteudoSalvo() {
    const saved = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    
    // Hero
    if (saved.hero) {
        const lines = saved.hero.split('\n').filter(l => l.trim());
        const titleEl = document.querySelector('.hero__title');
        const subEl = document.querySelector('.hero__subtitle');
        if (titleEl && lines[0]) titleEl.textContent = lines[0].trim();
        if (subEl) {
            const rest = lines.slice(1).join('\n').trim();
            subEl.innerHTML = rest.replace(/\n/g, '<br>');
        }
    }
    
    // Apresentação
    if (saved.apresentacao) {
        const pEl = document.querySelector('.section#apresentacao .grid-2 p');
        if (pEl) pEl.textContent = saved.apresentacao;
    }
    
    // Objetivos
    if (saved.objetivos) {
        const ulEl = document.querySelector('.section#apresentacao .grid-2 ul');
        if (ulEl) {
            const items = saved.objetivos.split('\n').filter(l => l.trim());
            ulEl.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
        }
    }
    
    console.log('✅ Conteúdo salvo carregado!');
}

// Carregar conteúdo ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    carregarConteudoSalvo();
});
EOF
