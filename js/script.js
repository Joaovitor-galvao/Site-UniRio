// ============================================
// VOTO CONSCIENTE — UNIRIO
// Script principal: acessibilidade, menu mobile,
// alto contraste, ajuste de fonte
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // =========================
    // MENU MOBILE
    // =========================
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.getElementById('primary-menu');

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', function () {
            const expanded = this.getAttribute('aria-expanded') === 'true' ? false : true;
            this.setAttribute('aria-expanded', expanded);
            navList.classList.toggle('open');
        });

        // Fechar menu ao clicar em um link (em mobile)
        navList.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.innerWidth <= 768) {
                    navList.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Dropdown em mobile: abrir/fechar ao clicar no item pai
        const dropdownParents = navList.querySelectorAll('.has-dropdown > a');
        dropdownParents.forEach(function (parentLink) {
            parentLink.addEventListener('click', function (e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const li = this.parentElement;
                    li.classList.toggle('open');
                }
            });
        });
    }

    // =========================
    // ALTO CONTRASTE
    // =========================
    const contrastBtn = document.getElementById('high-contrast');
    if (contrastBtn) {
        contrastBtn.addEventListener('click', function () {
            document.body.classList.toggle('high-contrast');
            const isHighContrast = document.body.classList.contains('high-contrast');
            this.textContent = isHighContrast ? 'Contraste normal' : 'Alto contraste';
            this.setAttribute('aria-pressed', isHighContrast);
        });
    }

    // =========================
    // AJUSTE DE FONTE
    // =========================
    const fontInc = document.getElementById('font-inc');
    const fontDec = document.getElementById('font-dec');

    // Valor inicial baseado no root
    let currentScale = 1;
    const minScale = 0.8;
    const maxScale = 1.8;

    function updateFontScale(scale) {
        currentScale = Math.min(maxScale, Math.max(minScale, scale));
        document.documentElement.style.setProperty('--font-scale', currentScale);
        // Salva preferência no localStorage
        try {
            localStorage.setItem('voto-consciente-font-scale', currentScale);
        } catch (e) { /* ignore */ }
    }

    // Carrega preferência salva
    try {
        const saved = localStorage.getItem('voto-consciente-font-scale');
        if (saved) {
            const val = parseFloat(saved);
            if (!isNaN(val) && val >= minScale && val <= maxScale) {
                currentScale = val;
                document.documentElement.style.setProperty('--font-scale', currentScale);
            }
        }
    } catch (e) { /* ignore */ }

    if (fontInc) {
        fontInc.addEventListener('click', function () {
            updateFontScale(currentScale + 0.1);
        });
    }

    if (fontDec) {
        fontDec.addEventListener('click', function () {
            updateFontScale(currentScale - 0.1);
        });
    }

    // =========================
    // NAVEGAÇÃO POR TECLADO (dropdown)
    // =========================
    // Garantir que dropdowns sejam acessíveis via teclado
    const dropdownLinks = document.querySelectorAll('.has-dropdown > a');
    dropdownLinks.forEach(function (link) {
        link.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                // Em desktop, apenas segue o link; em mobile, já tratamos no clique
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const li = this.parentElement;
                    li.classList.toggle('open');
                }
            }
        });
    });

    // =========================
    // SKIP LINK: foco no main
    // =========================
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function (e) {
            e.preventDefault();
            const main = document.getElementById('main-content');
            if (main) {
                main.setAttribute('tabindex', '-1');
                main.focus();
                // Remove o tabindex após perder o foco
                main.addEventListener('blur', function () {
                    this.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }

    // =========================
    // FECHAR MENU COM ESC
    // =========================
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (navList && navList.classList.contains('open')) {
                navList.classList.remove('open');
                if (menuToggle) {
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });

    console.log('Voto Consciente — UNIRIO carregado com sucesso.');
});