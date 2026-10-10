
/**
 * CON(S)CIÊNCIA POLÍTICA
 * Custom Admin JavaScript corrigido
 */

(function () {
  'use strict';

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  // Navegação lateral

  class SidebarNavigation {
    constructor() {
      this.sidebar = $('#sidebar');
      this.overlay = $('#sidebarOverlay');
      this.toggleButton = $('.mobile-menu-toggle');
      this.isOpen = false;
      this.init();
    }

    init() {
      this.toggleButton?.addEventListener('click', () =>
        this.toggleSidebar()
      );

      this.overlay?.addEventListener('click', () =>
        this.close()
      );

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      window.addEventListener('resize', debounce(() => {
        if (window.innerWidth >= 1024 && this.isOpen) {
          this.close();
        }
      }, 250));
    }

    toggleSidebar() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      document.body.classList.add('sidebar-open');
      this.sidebar?.classList.add('open');
      this.overlay?.classList.add('visible');
      document.documentElement.style.overflow = 'hidden';
    }

    close() {
      this.isOpen = false;
      document.body.classList.remove('sidebar-open');
      this.sidebar?.classList.remove('open');
      this.overlay?.classList.remove('visible');
      document.documentElement.style.overflow = '';
    }

    toggle() {
      this.toggleSidebar();
    }
  }

  // Menu do usuário - uma única declaração

  class UserDropdown {
    constructor() {
      this.trigger = $('.user-trigger');
      this.dropdown = $('.user-dropdown');
      this.isOpen = false;
      this.init();
    }

    init() {
      if (!this.trigger || !this.dropdown) return;

      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      document.addEventListener('click', (e) => {
        if (
          this.isOpen &&
          !this.dropdown.contains(e.target) &&
          !this.trigger.contains(e.target)
        ) {
          this.close();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }

    open() {
      this.isOpen = true;
      this.trigger.setAttribute('aria-expanded', 'true');
      this.dropdown.style.display = 'block';
      this.dropdown.style.visibility = 'visible';
      this.dropdown.style.opacity = '1';
    }

    close() {
      this.isOpen = false;
      this.trigger.setAttribute('aria-expanded', 'false');
      this.dropdown.style.display = 'none';
      this.dropdown.style.visibility = 'hidden';
      this.dropdown.style.opacity = '0';
    }
  }

  // Alertas

  class AlertManager {
    constructor() {
      this.alerts = $$('.alert');
      this.init();
    }

    init() {
      this.alerts.forEach((alert) => {
        const dismissBtn = $('.alert-dismiss', alert);

        dismissBtn?.addEventListener('click', () =>
          this.dismiss(alert)
        );

        if (
          alert.classList.contains('alert-success') ||
          alert.classList.contains('alert-info')
        ) {
          setTimeout(() => this.dismiss(alert), 5000);
        }
      });
    }

    dismiss(alert) {
      if (!alert.isConnected) return;
      alert.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => alert.remove(), 300);
    }
  }

  // Tabelas e ordenação

  class TableEnhancements {
    constructor() {
      this.tables = $$('.table-container table');
      this.init();
    }

    init() {
      this.tables.forEach((table) => {
        const headers = $$('th[data-sort]', table);

        headers.forEach((th) => {
          th.style.cursor = 'pointer';
          th.addEventListener('click', () =>
            this.sortTable(th)
          );
        });
      });
    }

    sortTable(th) {
      const table = th.closest('table');
      if (!table) return;

      const tbody = $('tbody', table);
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      const columnIndex = Array.from(
        th.parentNode.children
      ).indexOf(th);

      const isAsc = !th.classList.contains('sort-asc');

      $$('th', th.parentNode).forEach((header) => {
        header.classList.remove('sort-asc', 'sort-desc');
      });

      const sortedRows = rows.sort((a, b) => {
        const aText =
          a.children[columnIndex]?.textContent.trim() ?? '';

        const bText =
          b.children[columnIndex]?.textContent.trim() ?? '';

        const aNum = Number(aText);
        const bNum = Number(bText);

        if (
          aText !== '' &&
          bText !== '' &&
          Number.isFinite(aNum) &&
          Number.isFinite(bNum)
        ) {
          return aNum - bNum;
        }

        return aText.localeCompare(bText, undefined, {
          numeric: true,
          sensitivity: 'base'
        });
      });

      if (!isAsc) {
        sortedRows.reverse();
      }

      // Reutiliza o tbody declarado no início.
      sortedRows.forEach((row) => tbody.appendChild(row));

      th.classList.add(
        isAsc ? 'sort-asc' : 'sort-desc'
      );
    }
  }

  // Formulários

  class FormEnhancements {
    constructor() {
      this.init();
    }

    init() {
      const firstInput = $(
        'input:not([type="hidden"]), select, textarea'
      );

      if (firstInput && !document.querySelector(':focus')) {
        firstInput.focus();
      }

      $$('textarea').forEach((textarea) => {
        textarea.addEventListener('input', function () {
          this.style.height = 'auto';
          this.style.height = this.scrollHeight + 'px';
        });
      });

      $$('input[maxlength]:not([type="color"]), textarea[maxlength]').forEach((input) => {
        const maxLength = parseInt(
          input.getAttribute('maxlength'), 10
        );

        if (!Number.isFinite(maxLength)) return;
        if (input.nextElementSibling?.classList.contains('char-counter')) {
          return;
        }

        const counter = document.createElement('div');
        counter.className = 'char-counter';

        counter.style.cssText = [
          'font-size:0.75rem',
          'color:var(--color-gray-500)',
          'text-align:right',
          'margin-top:4px'
        ].join(';');

        input.insertAdjacentElement('afterend', counter);

        const updateCounter = () => {
          const remaining = maxLength - input.value.length;

          counter.textContent =
            `${input.value.length}/${maxLength}`;

          counter.style.color = remaining < 10
            ? 'var(--color-error)'
            : 'var(--color-gray-500)';
        };

        input.addEventListener('input', updateCounter);
        updateCounter();
      });
    }
  }

  // Navegação nas linhas de tabelas
  // Centralizada para evitar eventos duplicados.

  class TableRowNavigation {
    static init() {
      $$('tbody tr[data-href]').forEach((row) => {
        row.style.cursor = 'pointer';
        row.setAttribute('tabindex', '0');

        const navigate = () => {
          const href = row.dataset.href;
          if (href) window.location.href = href;
        };

        row.addEventListener('click', (e) => {
          if (
            e.target.closest(
              'a, button, input, select, textarea, label'
            )
          ) {
            return;
          }

          navigate();
        });

        row.addEventListener('keydown', (e) => {
          if (
            (e.key === 'Enter' || e.key === ' ') &&
            e.target === row
          ) {
            e.preventDefault();
            navigate();
          }
        });
      });
    }
  }

  // Compatibilidade com chamadas antigas

  class TableActions {
    static init() {
      // A navegação é inicializada por TableRowNavigation.
    }
  }

  // Confirmações personalizadas

  class ConfirmDialog {
    static confirm(message, onConfirm, onCancel) {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';

      const dialog = document.createElement('div');
      dialog.className = 'confirm-dialog';

      const header = document.createElement('div');
      header.className = 'confirm-header';

      const title = document.createElement('h3');
      title.textContent = 'Confirmar ação';
      header.appendChild(title);

      const description = document.createElement('p');
      description.textContent = message;

      const actions = document.createElement('div');
      actions.className = 'confirm-actions';

      const cancelBtn = document.createElement('button');
      cancelBtn.type = 'button';
      cancelBtn.className = 'btn btn-secondary btn-cancel';
      cancelBtn.textContent = 'Cancelar';

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.className = 'btn btn-danger btn-confirm';
      confirmBtn.textContent = 'Confirmar';

      actions.append(cancelBtn, confirmBtn);
      dialog.append(header, description, actions);
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const cleanup = () => {
        overlay.remove();
        document.removeEventListener('keydown', handleKeydown);
      };

      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          cleanup();
          if (onCancel) onCancel();
        }
      };

      cancelBtn.addEventListener('click', () => {
        cleanup();
        if (onCancel) onCancel();
      });

      confirmBtn.addEventListener('click', () => {
        cleanup();
        if (onConfirm) onConfirm();
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup();
          if (onCancel) onCancel();
        }
      });

      document.addEventListener('keydown', handleKeydown);
      confirmBtn.focus();
    }
  }

  // Busca

  class SearchEnhancement {
    constructor() {
      this.searchInput = $('#searchbar');
      this.init();
    }

    init() {
      if (!this.searchInput) return;

      const parent = this.searchInput.parentElement;
      if (!parent || $('.search-clear', parent)) return;

      const clearBtn = document.createElement('button');

      clearBtn.type = 'button';
      clearBtn.className = 'search-clear';
      clearBtn.textContent = '×';
      clearBtn.setAttribute('aria-label', 'Limpar busca');

      clearBtn.style.cssText = [
        'position:absolute',
        'right:8px',
        'top:50%',
        'transform:translateY(-50%)',
        'background:none',
        'border:none',
        'padding:4px',
        'cursor:pointer',
        'display:none'
      ].join(';');

      parent.style.position = 'relative';
      parent.appendChild(clearBtn);

      const updateVisibility = () => {
        clearBtn.style.display =
          this.searchInput.value ? 'flex' : 'none';
      };

      this.searchInput.addEventListener(
        'input', updateVisibility
      );

      clearBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchInput.focus();

        this.searchInput.dispatchEvent(
          new Event('input', { bubbles: true })
        );
      });

      updateVisibility();
    }
  }

  // Interruptores

  class ToggleSwitch {
    static init() {
      $$('.toggle-switch input[type="checkbox"]').forEach(
        (checkbox) => {
          if (checkbox.closest('.toggle-wrapper')) return;

          const wrapper = document.createElement('div');
          wrapper.className = 'toggle-wrapper';

          checkbox.parentNode.insertBefore(wrapper, checkbox);
          wrapper.appendChild(checkbox);

          const slider = document.createElement('span');
          slider.className = 'toggle-slider';
          wrapper.appendChild(slider);

          const update = () => {
            wrapper.classList.toggle(
              'checked', checkbox.checked
            );
          };

          checkbox.addEventListener('change', update);
          update();
        }
      );
    }
  }

  // Ações em massa

  class BulkActions {
    static init() {
      const selectAll = $('#action-toggle');
      if (!selectAll) return;

      const checkboxes = $$(
        '.action-checkbox input[type="checkbox"]'
      );

      selectAll.addEventListener('change', () => {
        checkboxes.forEach((checkbox) => {
          checkbox.checked = selectAll.checked;
        });

        BulkActions.updateCounter();
      });

      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
          BulkActions.updateCounter();
        });
      });

      BulkActions.updateCounter();
    }

    static updateCounter() {
      const count = $$(
        '.action-checkbox input[type="checkbox"]:checked'
      ).length;

      const counter = $('#selected-count');

      if (counter) {
        counter.textContent =
          `${count} selecionado${count !== 1 ? 's' : ''}`;
      }
    }
  }

  // Atalhos de teclado

  class KeyboardShortcuts {
    static init() {
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          const key = e.key.toLowerCase();

          if (key === 'k') {
            const searchInput = $('#searchbar');

            if (searchInput) {
              e.preventDefault();
              searchInput.focus();
              searchInput.select();
            }
          }

          if (key === 's') {
            const saveBtn = $(
              'input[type="submit"][name="_save"], ' +
              'button[type="submit"][name="_save"]'
            );

            if (saveBtn) {
              e.preventDefault();
              saveBtn.click();
            }
          }
        }
      });
    }
  }

  // Indicador de edição
  // Não envia dados automaticamente ao servidor.

  class AutoSave {
    static init(selector = 'form', interval = 30000) {
      $$(selector).forEach((form) => {
        let timeout;

        $$('input, select, textarea', form).forEach(
          (input) => {
            input.addEventListener('input', () => {
              clearTimeout(timeout);

              timeout = setTimeout(() => {
                let indicator = $('.autosave-indicator');

                if (!indicator) {
                  indicator = document.createElement('div');
                  indicator.className = 'autosave-indicator';

                  indicator.style.cssText = [
                    'position:fixed',
                    'bottom:20px',
                    'right:20px',
                    'padding:10px 15px',
                    'background:#a83e6a',
                    'color:white',
                    'border-radius:8px',
                    'z-index:1000'
                  ].join(';');

                  document.body.appendChild(indicator);
                }

                indicator.textContent =
                  'Alterações pendentes de salvar';

                setTimeout(() => {
                  indicator.remove();
                }, 2000);
              }, 2000);
            });
          }
        );
      });
    }
  }

  // Inicialização do painel

  function initAdmin() {
    window.sidebarNav = new SidebarNavigation();
    window.userDropdown = new UserDropdown();
    window.alertManager = new AlertManager();
    window.tableEnhancements = new TableEnhancements();
    window.formEnhancements = new FormEnhancements();

    TableRowNavigation.init();
    TableActions.init();
    ToggleSwitch.init();
    BulkActions.init();
    KeyboardShortcuts.init();

    window.searchEnhancement = new SearchEnhancement();

    $$('form[data-autosave]').forEach((form) => {
      if (form.id) {
        AutoSave.init(`#${CSS.escape(form.id)}`);
      }
    });

    document.body.classList.add('admin-loaded');

    console.log(
      'CON(S)CIÊNCIA POLÍTICA Admin initialized'
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }

  // Acesso global às funcionalidades

  window.AdminUI = {
    SidebarNavigation,
    UserDropdown,
    AlertManager,
    TableEnhancements,
    FormEnhancements,
    TableActions,
    ConfirmDialog,
    SearchEnhancement,
    TableRowNavigation,
    ToggleSwitch,
    BulkActions,
    KeyboardShortcuts,
    AutoSave
  };

})();
