document.addEventListener('DOMContentLoaded', function () {

    const searchData = [
        { title: 'Início', url: 'index.html', category: 'Página', keywords: 'inicio home principal' },
        { title: 'Sobre', url: 'sobre.html', category: 'Página', keywords: 'sobre projeto unirio' },
        { title: 'Eventos', url: 'eventos.html', category: 'Página', keywords: 'eventos atividades agenda' },

        { title: 'Eleições 2026', url: 'eleicoes-2026.html', category: 'Eleições', keywords: 'eleicoes voto 2026' },

        { title: 'Presidente', url: 'presidente.html', category: 'Cargo', keywords: 'presidente presidencia brasil' },
        { title: 'Candidatos a Presidente', url: 'candidatos-presidente.html', category: 'Candidatos', keywords: 'candidatos presidente' },

        { title: 'Luiz Inácio Lula da Silva', url: 'candidato-presidente-1.html', category: 'Presidente', keywords: 'lula luiz inacio lula da silva pt 13' },
        { title: 'Flávio Bolsonaro', url: 'candidato-presidente-2.html', category: 'Presidente', keywords: 'flavio bolsonaro' },
        { title: 'Romeu Zema', url: 'candidato-presidente-3.html', category: 'Presidente', keywords: 'romeu zema novo' },
        { title: 'Ronaldo Caiado', url: 'candidato-presidente-4.html', category: 'Presidente', keywords: 'ronaldo caiado' },
        { title: 'Samara Martins', url: 'candidato-presidente-5.html', category: 'Presidente', keywords: 'samara martins' },
        { title: 'Renan Santos', url: 'candidato-presidente-6.html', category: 'Presidente', keywords: 'renan santos' },
        { title: 'Hertz Dias', url: 'candidato-presidente-7.html', category: 'Presidente', keywords: 'hertz dias' },
        { title: 'Clariana Barão', url: 'candidato-presidente-8.html', category: 'Presidente', keywords: 'clariana barao' },
        { title: 'Edmilson Costa', url: 'candidato-presidente-9.html', category: 'Presidente', keywords: 'edmilson costa' },
        { title: 'Augusto Cury', url: 'candidato-presidente-10.html', category: 'Presidente', keywords: 'augusto cury' },
        { title: 'Rui Costa Pimenta', url: 'candidato-presidente-11.html', category: 'Presidente', keywords: 'rui costa pimenta' },
        { title: 'Wilson Grassi', url: 'candidato-presidente-12.html', category: 'Presidente', keywords: 'wilson grassi' },


        { title: 'Governador', url: 'governador.html', category: 'Cargo', keywords: 'governador governo estado rio janeiro rj' },
        { title: 'Candidatos a Governador', url: 'candidatos-governador.html', category: 'Candidatos', keywords: 'governador candidatos rio janeiro rj' },

        { title: 'André Marinho', url: 'candidato-governador-1.html', category: 'Governador', keywords: 'andre marinho novo 30' },
        { title: 'Anthony Garotinho', url: 'candidato-governador-2.html', category: 'Governador', keywords: 'anthony garotinho republicanos 10' },
        { title: 'Coronel Busnello', url: 'candidato-governador-3.html', category: 'Governador', keywords: 'coronel busnello missao 14' },
        { title: 'Cyro Garcia', url: 'candidato-governador-4.html', category: 'Governador', keywords: 'cyro garcia pstu 16' },
        { title: 'Douglas Ruas', url: 'candidato-governador-5.html', category: 'Governador', keywords: 'douglas ruas pl 22' },
        { title: 'Eduardo Paes', url: 'candidato-governador-6.html', category: 'Governador', keywords: 'eduardo paes psd 55' },
        { title: 'Juliete Pantoja', url: 'candidato-governador-7.html', category: 'Governador', keywords: 'juliete pantoja up 80' },
        { title: 'Luan Monteiro', url: 'candidato-governador-8.html', category: 'Governador', keywords: 'luan monteiro pco 29' },
        { title: 'William Siri', url: 'candidato-governador-9.html', category: 'Governador', keywords: 'william siri psol 50' },

        { title: 'Informações', url: 'informacoes.html', category: 'Página', keywords: 'informacoes dados' },
        { title: 'Conteúdo Interativo', url: 'conteudo-interativo.html', category: 'Interativo', keywords: 'conteudo atividades' },
        { title: 'Quiz', url: 'quiz.html', category: 'Interativo', keywords: 'quiz perguntas' },
        { title: 'Simulador', url: 'simulador.html', category: 'Interativo', keywords: 'simulador prioridades' },
        { title: 'Você é o Senador', url: 'voce-e-o-senador.html', category: 'Interativo', keywords: 'senador jogo' },
        { title: 'Flashcards', url: 'flashcards.html', category: 'Interativo', keywords: 'flashcards estudo' },
        { title: 'Referências', url: 'referencias.html', category: 'Página', keywords: 'referencias fontes' },
        { title: 'Contato', url: 'contato.html', category: 'Página', keywords: 'contato email fale conosco' }
    ];

    function normalizar(texto) {
        return (texto || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    const input = document.getElementById('search-input');
    const results = document.getElementById('search-results');

    if (!input || !results) {
        return;
    }

    input.placeholder = '';

    function pesquisar() {
        const termo = normalizar(input.value.trim());

        if (termo.length < 2) {
            results.style.display = 'none';
            results.innerHTML = '';
            return;
        }

        const encontrados = searchData.filter(item => {
            const texto = normalizar(
                item.title + ' ' +
                item.category + ' ' +
                item.keywords
            );

            return texto.includes(termo);
        });

        results.innerHTML = '';

        if (encontrados.length === 0) {
            results.innerHTML = `
                <div class="search-result-empty">
                    <span>🔍</span>
                    <p>Nenhum resultado encontrado</p>
                </div>
            `;
            results.style.display = 'block';
            return;
        }

        encontrados.forEach(item => {
            const link = document.createElement('a');
            link.href = item.url;
            link.className = 'search-result-item';

            link.innerHTML = `
                <strong>${item.title}</strong>
                <span class="category">${item.category}</span>
            `;

            results.appendChild(link);
        });

        results.style.display = 'block';
    }

    input.addEventListener('input', pesquisar);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();

            const primeiro = results.querySelector('a');

            if (primeiro) {
                window.location.href = primeiro.href;
            }
        }

        if (e.key === 'Escape') {
            results.style.display = 'none';
        }
    });

    document.addEventListener('click', function (e) {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.style.display = 'none';
        }
    });

    console.log('🔍 Pesquisa carregada');
});
