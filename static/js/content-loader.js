// ============================================
// CONTENT LOADER - Carrega content.json + localStorage
// Este arquivo garante que:
//   1. O público vê o conteúdo do content.json (commitado)
//   2. Admin vê suas edições locais (localStorage) por cima
// ============================================

(function() {
  'use strict';

  const STORAGE_KEY = 'votoConscienteContent';
  const CONTENT_JSON = 'content.json';

  // ============================================
  // Aplicar conteúdo em elementos da página
  // ============================================
  function aplicarConteudo(content) {
    if (!content || typeof content !== 'object') return;

    Object.keys(content).forEach(function(key) {
      const valor = content[key];
      if (valor === undefined || valor === null) return;

      // 1. Procurar por data-key (marcados pelo admin.js)
      let el = document.querySelector('[data-key="' + key + '"]');

      // 2. Fallback: procurar por ID
      if (!el) el = document.getElementById(key);

      // 3. Fallback: procurar por atributo data-content
      if (!el) el = document.querySelector('[data-content="' + key + '"]');

      if (!el) return;

      // Aplicar valor
      if (el.tagName === 'IMG') {
        el.src = valor;
      } else if (key.includes('_html') || valor.includes('<')) {
        el.innerHTML = valor;
      } else {
        el.textContent = valor;
      }
    });
  }

  // ============================================
  // Carregar content.json (público)
  // ============================================
  function carregarContentJson() {
    return fetch(CONTENT_JSON + '?v=' + Date.now())
      .then(function(r) {
        if (!r.ok) throw new Error('content.json não encontrado');
        return r.json();
      })
      .catch(function() { return {}; });
  }

  // ============================================
  // Carregar localStorage (admin local)
  // ============================================
  function carregarLocalStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  // ============================================
  // INICIALIZAÇÃO
  // ============================================
  function init() {
    Promise.all([carregarContentJson(), Promise.resolve(carregarLocalStorage())])
      .then(function(results) {
        const contentJson = results[0];
        const contentLocal = results[1];

        // 1. Aplica o conteúdo público (content.json)
        if (Object.keys(contentJson).length > 0) {
          aplicarConteudo(contentJson);
          console.log('📄 content.json aplicado (' + Object.keys(contentJson).length + ' itens)');
        }

        // 2. Sobrescreve com as edições locais (se houver)
        if (Object.keys(contentLocal).length > 0) {
          aplicarConteudo(contentLocal);
          console.log('💾 localStorage aplicado (' + Object.keys(contentLocal).length + ' itens)');
        }
      })
      .catch(function(err) {
        console.warn('Erro ao carregar conteúdo:', err);
      });
  }

  // Exporta para uso externo
  window.ContentLoader = {
    aplicarConteudo: aplicarConteudo,
    carregarContentJson: carregarContentJson,
    carregarLocalStorage: carregarLocalStorage,
    init: init
  };

  // Roda quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
