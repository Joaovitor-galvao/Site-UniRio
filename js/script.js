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
    if (saved.equipe) {
        const container = document.querySelector('#equipe .equipe-slider');
        if (container) {
            const slides = saved.equipe.split('\n').filter(l => l.trim());
            container.innerHTML = slides.map((slide, i) => {
                const [titulo, ...rest] = slide.split('|').map(s => s.trim());
                return `
                    <div class="equipe-slide ${i === 0 ? 'ativo' : ''}">
                        <div class="equipe-slide__texto">
                            <h3>${titulo}</h3>
                            ${rest.map(r => `<p>${r}</p>`).join('')}
                        </div>
                    </div>
                `;
            }).join('') + `
                <button class="equipe-seta equipe-seta--esquerda" onclick="mudarSlideEquipe(-1)" aria-label="Imagem anterior">❮</button>
                <button class="equipe-seta equipe-seta--direita" onclick="mudarSlideEquipe(1)" aria-label="Próxima imagem">❯</button>
                <div class="equipe-bolhas">${slides.map((_, i) => `<button class="equipe-bolha ${i === 0 ? 'ativo' : ''}" onclick="mostrarSlideEquipe(${i})" aria-label="Mostrar slide ${i+1}"></button>`).join('')}</div>
            `;
        }
    }
    if (saved.eventos) {
        const container = document.querySelector('.section .grid-2');
        if (container && container.previousElementSibling?.textContent?.includes('Eventos')) {
            const items = saved.eventos.split('\n').filter(l => l.trim());
            container.innerHTML = items.map(item => {
                const [titulo, data, local] = item.split('|').map(s => s.trim());
                return `<div class="card"><h3>${titulo}</h3><p><strong>Data:</strong> ${data || ''}</p><p><strong>Local:</strong> ${local || ''}</p></div>`;
            }).join('');
        }
    }
    if (saved.noticias) {
        const container = document.querySelector('.section .grid-2');
        if (container && container.previousElementSibling?.textContent?.includes('Notícias')) {
            const items = saved.noticias.split('\n').filter(l => l.trim());
            container.innerHTML = items.map(item => {
                const [titulo, data, desc] = item.split('|').map(s => s.trim());
                return `<article class="card news-card"><h3>${titulo}</h3><p>${desc || ''}</p><time datetime="${data || ''}">${data || ''}</time></article>`;
            }).join('');
        }
    }
    if (saved.cards) {
        const track = document.querySelector('.destaques-track');
        if (track) {
            const items = saved.cards.split('\n').filter(l => l.trim());
            track.innerHTML = items.map(item => {
                const [titulo, desc, link] = item.split('|').map(s => s.trim());
                return `<a href="${link || '#'}" class="card card--link destaque-item"><h3>${titulo}</h3><p>${desc || ''}</p></a>`;
            }).join('');
        }
    }
    if (saved.footer) {
        const footerP = document.querySelector('.footer__col p');
        if (footerP) footerP.textContent = saved.footer;
    }
    if (saved.candidatos) {
        console.log('Candidatos atualizados:', saved.candidatos);
    }
}

// ===== BARRA DE PESQUISA =====
const searchData = [
    { title: 'Início', url: 'index.html', category: 'Página', keywords: 'home principal inicio' },
    { title: 'Sobre', url: 'sobre.html', category: 'Página', keywords: 'projeto unirio consciencia politica' },
    { title: 'Eventos', url: 'eventos.html', category: 'Página', keywords: 'eventos atividades agenda' },

    { title: 'Eleições 2026', url: 'eleicoes-2026.html', category: 'Eleições', keywords: 'eleicao eleicoes voto cargos 2026' },

    { title: 'Presidente da República', url: 'presidente.html', category: 'Cargo', keywords: 'presidente presidencia brasil eleicoes' },
    { title: 'Candidatos a Presidente', url: 'candidatos-presidente.html', category: 'Candidatos', keywords: 'presidente candidatos presidencia' },

    { title: 'Governador do Rio de Janeiro', url: 'governador.html', category: 'Cargo', keywords: 'governador governo estado rio de janeiro rj' },
    { title: 'Candidatos a Governador do RJ', url: 'candidatos-governador.html', category: 'Candidatos', keywords: 'governador candidatos governo rio janeiro rj' },

    { title: 'André Marinho', url: 'candidato-governador-1.html', category: 'Governador', keywords: 'andre marinho novo 30' },
    { title: 'Coronel Busnello', url: 'candidato-governador-3.html', category: 'Governador', keywords: 'coronel busnello missao 14' },
    { title: 'Cyro Garcia', url: 'candidato-governador-4.html', category: 'Governador', keywords: 'cyro garcia pstu 16' },
    { title: 'Douglas Ruas', url: 'candidato-governador-5.html', category: 'Governador', keywords: 'douglas ruas pl 22' },
    { title: 'Eduardo Paes', url: 'candidato-governador-6.html', category: 'Governador', keywords: 'eduardo paes psd 55' },
    { title: 'Juliete Pantoja', url: 'candidato-governador-7.html', category: 'Governador', keywords: 'juliete pantoja up 80' },
    { title: 'Luan Monteiro', url: 'candidato-governador-8.html', category: 'Governador', keywords: 'luan monteiro pco 29' },
    { title: 'William Siri', url: 'candidato-governador-9.html', category: 'Governador', keywords: 'william siri psol 50' },

    { title: 'Informações', url: 'informacoes.html', category: 'Página', keywords: 'informacoes dados politica' },
    { title: 'Conteúdo Interativo', url: 'conteudo-interativo.html', category: 'Interativo', keywords: 'conteudo atividades jogos' },
    { title: 'Quiz', url: 'quiz.html', category: 'Interativo', keywords: 'quiz perguntas teste politica' },
    { title: 'Simulador', url: 'simulador.html', category: 'Interativo', keywords: 'simulador prioridades politica' },
    { title: 'Você é o Senador', url: 'voce-e-o-senador.html', category: 'Interativo', keywords: 'senador jogo' },
    { title: 'Flashcards', url: 'flashcards.html', category: 'Interativo', keywords: 'flashcards estudo perguntas' },
    { title: 'Referências', url: 'referencias.html', category: 'Página', keywords: 'referencias fontes bibliografia' },
    { title: 'Contato', url: 'contato.html', category: 'Página', keywords: 'contato fale conosco email' }
];

function normalizarBusca(texto) {
    return (texto || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();
}

function buscar(query) {
    const termo = normalizarBusca(query);

    if (!termo) return [];

    return searchData.filter(item => {
        const alvo = normalizarBusca(
            item.title + ' ' +
            item.category + ' ' +
            (item.keywords || '')
        );

        return alvo.includes(termo);
    });
}

function mostrarResultados(query) {
    const container = document.getElementById('search-results');

    if (!container) return;

    const resultados = buscar(query);

    container.innerHTML = '';

    if (resultados.length === 0) {
        container.innerHTML = `
            <div class="search-result-empty">
                <span>🔍</span>
                <p>Nenhum resultado encontrado</p>
            </div>
        `;

        container.style.display = 'block';
        return;
    }

    resultados.forEach(item => {
        const link = document.createElement('a');

        link.href = item.url;
        link.className = 'search-result-item';

        link.innerHTML = `
            <strong>${item.title}</strong>
            <span class="category">${item.category}</span>
        `;

        container.appendChild(link);
    });

    container.style.display = 'block';
}

function initSearch() {
    const input = document.getElementById('search-input');
    const resultados = document.getElementById('search-results');

    if (!input || !resultados) {
        console.log('Pesquisa não encontrada nesta página.');
        return;
    }

    input.placeholder = 'Pesquisar...';

    input.addEventListener('input', function() {
        const termo = this.value.trim();

        if (termo.length >= 2) {
            mostrarResultados(termo);
        } else {
            resultados.style.display = 'none';
        }
    });

    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();

            const encontrados = buscar(this.value);

            if (encontrados.length > 0) {
                window.location.href = encontrados[0].url;
            }
        }

        if (event.key === 'Escape') {
            resultados.style.display = 'none';
            this.blur();
        }
    });

    document.addEventListener('click', function(event) {
        if (
            !input.contains(event.target) &&
            !resultados.contains(event.target)
        ) {
            resultados.style.display = 'none';
        }
    });

    console.log('🔍 Pesquisa funcionando!');
}


// ===== INICIALIZAR =====
document.addEventListener('DOMContentLoaded', async function() {
    console.log('📄 DOM carregado - Inicializando...');
    carregarPreferencias();
    initMenuMobile();
    initSkipLink();
    await carregarConteudoSalvo();
    initSearch();
    
    // Firebase real-time carregado de forma opcional
    import('./storage.js')
        .then(({ onContentChange }) => {
            onContentChange((content) => {
                console.log('🔄 Atualização real-time recebida');
                aplicarConteudo(content);
            });
        })
        .catch((err) => {
            console.warn('Firebase não carregado:', err);
        });
    
    console.log('✅ Site inicializado!');
});
