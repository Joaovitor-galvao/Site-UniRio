// ============================================
// RENDERIZAÇÃO DOS CANDIDATOS
// ============================================

function renderizarListaCandidatos() {
    const grid = document.querySelector('.candidatos-grid');
    if (!grid) return;

    grid.innerHTML = CANDIDATOS_PRESIDENTE.map(c => `
        <a href="candidato-presidente-${c.id}.html" class="candidato-card">
            <img src="${c.foto}" alt="${c.nome}" class="foto-candidato"
                 onerror="this.onerror=null;this.src='imagens/candidatos/candidato-${c.id}.svg';">
            <div class="info-candidato">
                <span class="numero-partido">  ${c.numero} • ${c.partido}</span>
                <h3>${c.nome}</h3>
                <p class="partido">${c.partido} - ${c.partidoNome}</p>
                <p class="coligacao">Vice: ${c.vice}${c.vicePartido ? ' (' + c.vicePartido + ')' : ''}</p>
            </div>
            <span class="seta">→</span>
        </a>
    `).join('');
}

function renderizarPaginaCandidato() {
    const id = parseInt(document.body.dataset.candidato);
    if (!id) return;

    const c = CANDIDATOS_PRESIDENTE.find(x => x.id === id);
    if (!c) return;

    const heroImg = document.querySelector('.candidato-hero .foto-grande');
    if (heroImg) {
        heroImg.src = c.foto;
        heroImg.alt = c.nome;
        heroImg.onerror = function() {
            this.onerror = null;
            this.src = 'imagens/candidatos/candidato-' + c.id + '.svg';
        };
    }

    const numPartido = document.querySelector('.candidato-hero .numero-partido');
    if (numPartido) numPartido.textContent = `  ${c.numero} • ${c.partido}`;

    const h1 = document.querySelector('.candidato-hero h1');
    if (h1) h1.textContent = c.nome;

    const partido = document.querySelector('.candidato-hero .partido');
    if (partido) partido.textContent = `${c.partido} - ${c.partidoNome}`;

    const colig = document.querySelector('.candidato-hero .coligacao');
    if (colig) colig.textContent = `Vice: ${c.vice}${c.vicePartido ? ' (' + c.vicePartido + ')' : ''}`;

    const cargo = document.querySelector('.candidato-hero .cargo');
    if (cargo) cargo.textContent = `Candidato(a) a Presidente da República — Eleições 2026`;

    const bio = document.querySelector('.biografia-box');
    if (bio) {
        bio.innerHTML = `
            <p><strong>Nome completo:</strong> ${c.nomeCompleto}</p>
            <p><strong>Data de nascimento:</strong> ${c.nascimento}</p>
            <p><strong>Naturalidade:</strong> ${c.naturalidade}</p>
            <p><strong>Profissão:</strong> ${c.profissao}</p>
            <p><strong>Formação:</strong> ${c.formacao}</p>
            <p><strong>Trajetória política:</strong> ${c.trajetoria}</p>
            <p><strong>Status TSE:</strong> ${c.statusTSE}</p>
        `;
    }

    const grid = document.querySelector('.propostas-grid');
    if (grid) {
        const icones = {
            "Saúde": "🏥", "Educação": "📚", "Economia": "💼",
            "Segurança Pública": "🛡️", "Segurança": "🛡️",
            "Meio Ambiente": "🌿", "Meio Ambiente e Energia": "🌿",
            "Infraestrutura": "🚌", "Trabalho": "👷", "Trabalho e Economia": "💼",
            "Democracia": "🏛️", "Administração": "🏛️", "Administração Pública": "🏛️",
            "Política Externa": "🌍", "Social": "🤝", "Desenvolvimento Social": "🤝",
            "Direitos": "⚖️", "Tributação": "💰", "Transporte": "🚌", "Terras": "🌱",
            "Habitação e Saneamento": "🏠", "Serviços Públicos": "🏛️",
            "Agricultura": "🌾", "Institucional": "🏛️", "Outros": "📌"
        };

        grid.innerHTML = Object.entries(c.propostas).map(([tema, itens]) => `
            <div class="proposta-card">
                <span class="icone">${icones[tema] || '📋'}</span>
                <h3>${tema}</h3>
                <ul>
                    ${itens.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    document.title = `${c.nome} — CON(S)CIÊNCIA POLÍTICA`;
}

document.addEventListener('DOMContentLoaded', function() {
    renderizarListaCandidatos();
    renderizarPaginaCandidato();
});
