// ============================================
// SCRIPT PRINCIPAL - CON(S)CIÊNCIA POLÍTICA
// ============================================

import { getContent, onContentChange } from './storage.js';

console.log('🚀 Script carregado!');

// ===== ALTO CONTRASTE =====
function toggleAltoContraste() {
    document.body.classList.toggle('high-contrast');
    const isActive = document.body.classList.contains('high-contrast');
    localStorage.setItem('votoConscienteHighContrast', isActive ? 'true' : 'false');
    const btn = document.getElementById('high-contrast');
    if (btn) {
        btn.textContent = isActive ? '🌙 Contraste Normal' : '☀️ Alto Contraste';
        btn.setAttribute('aria-pressed', isActive);
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
    console.log('Fonte ajustada para:', escala);
}

function resetarFonte() {
    document.documentElement.style.setProperty('--font-scale', 1);
    localStorage.setItem('votoConscienteFontSize', '1');
    console.log('Fonte resetada para o padrão');
}

// ===== CARREGAR PREFERÊNCIAS =====
function carregarPreferencias() {
    const highContrast = localStorage.getItem('votoConscienteHighContrast');
    if (highContrast === 'true') {
        document.body.classList.add('high-contrast');
        const btn = document.getElementById('high-contrast');
        if (btn) {
            btn.textContent = '🌙 Contraste Normal';
            btn.setAttribute('aria-pressed', 'true');
        }
    }
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

// ===== CARREGAR CONTEÚDO SALVO DO ADMIN =====
async function carregarConteudoSalvo() {
    try {
        const saved = await getContent();
        aplicarConteudo(saved);
        console.log('✅ Conteúdo salvo carregado!');
    } catch (err) {
        console.error('Erro ao carregar conteúdo:', err);
    }
}

function aplicarConteudo(saved) {
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
    if (saved.apresentacao) {
        const pEl = document.querySelector('.section#apresentacao .grid-2 p');
        if (pEl) pEl.textContent = saved.apresentacao;
    }
    if (saved.objetivos) {
        const ulEl = document.querySelector('.section#apresentacao .grid-2 ul');
        if (ulEl) {
            const items = saved.objetivos.split('\n').filter(l => l.trim());
            ulEl.innerHTML = items.map(item => `<li>${item.trim()}</li>`).join('');
        }
    }
}

// ===== BARRA DE PESQUISA =====
const searchData = [
    { title: 'Início', url: 'index.html', category: 'Página' },
    { title: 'Sobre', url: 'sobre.html', category: 'Página' },
    { title: 'Eventos', url: 'eventos.html', category: 'Página' },
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
    { title: 'Contato', url: 'contato.html', category: 'Página' },
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
        container.innerHTML = `<div class="search-result-empty"><span>🔍</span><p>Nenhum resultado encontrado</p></div>`;
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
    if (!searchInput) {
        console.log('❌ Input de busca não encontrado');
        return;
    }
    
    const container = document.getElementById('search-results');
    if (!container) {
        console.log('❌ Container de resultados não encontrado');
        return;
    }
    
    console.log('✅ Input e container encontrados');
    
    searchInput.addEventListener('input', function(e) {
        const query = this.value;
        console.log('Digitando:', query);
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
    
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            container.style.display = 'none';
            this.blur();
        }
    });
    
    console.log('🔍 Barra de pesquisa inicializada!');
}

// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM carregado - Inicializando...');
    carregarPreferencias();
    initMenuMobile();
    initSkipLink();
    await carregarConteudoSalvo();
    initSearch();
    
    // Real-time updates from Firebase
    onContentChange((content) => {
        console.log('🔄 Atualização real-time recebida');
        aplicarConteudo(content);
    });
    
    console.log('✅ Site inicializado!');
});

// ============================================
// CARREGAR CONTEÚDO SALVO DO ADMIN
// ============================================
function carregarConteudoSalvo() {
    const saved = JSON.parse(localStorage.getItem('votoConscienteContent') || '{}');
    
    if (Object.keys(saved).length === 0) {
        console.log('ℹ️ Nenhum conteúdo personalizado encontrado');
        return;
    }
    
    console.log('📂 Carregando conteúdo salvo:', Object.keys(saved));
    
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
    
    // Footer
    if (saved.footer) {
        const footerP = document.querySelector('.footer__col p');
        if (footerP) footerP.textContent = saved.footer;
    }
    
    console.log('✅ Conteúdo personalizado carregado!');
}

// Chamar ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    carregarConteudoSalvo();
});
