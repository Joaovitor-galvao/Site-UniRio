/**
 * CON(S)CIÊNCIA POLÍTICA - Custom Admin JavaScript
 * Enhanced UX for Django Admin
 */

(function() {
  'use strict';

  // ==========================================================================
  // Utility Functions
  // ==========================================================================
  
  const $ = (selector, context = document) => document.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
  
  const createElement = (tag, attributes = {}, children = []) => {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'class') element.className = value;
      else if (key === 'dataset') Object.entries(value).forEach(([k, v]) => element.dataset[k] = v);
      else if (key.startsWith('on')) element.addEventListener(key.slice(2).toLowerCase(), value);
      else element.setAttribute(key, value);
    });
    children.forEach(child => {
      if (typeof child === 'string') element.appendChild(document.createTextNode(child));
      else if (child instanceof Node) element.appendChild(child);
    });
    return element;
  };

  const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
  };

  // ==========================================================================
  // Sidebar Navigation
  // ==========================================================================
  
  class SidebarNavigation {
    constructor() {
      this.sidebar = document.getElementById('sidebar');
      this.overlay = document.getElementById('sidebarOverlay');
      this.toggle = document.querySelector('.mobile-menu-toggle');
      this.isOpen = false;
      this.init();
    }

    init() {
      if (this.toggle) {
        this.toggle.addEventListener('click', () => this.toggleSidebar());
      }
      
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });

      // Handle window resize
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
      document.documentElement.style.overflow = 'hidden';
    }

    close() {
      this.isOpen = false;
      document.body.classList.remove('sidebar-open');
      document.documentElement.style.overflow = '';
    }

    toggle() {
      this.isOpen ? this.close() : this.open();
    }
  }

  // ==========================================================================
  // User Dropdown
  // ==========================================================================

  class UserDropdown {
    constructor() {
      this.trigger = document.querySelector('.user-trigger');
      this.dropdown = document.querySelector('.user-dropdown');
      this.isOpen = false;
      this.init();
    }

    init() {
      if (!this.trigger || !this.dropdown) return;

      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.dropdown.contains(e.target) && e.target !== this.trigger) {
          this.close();
        }
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.trigger.setAttribute('aria-expanded', this.isOpen);
      this.dropdown.style.display = this.isOpen ? 'block' : 'none';
    }

    close() {
      this.isOpen = false;
      this.trigger.setAttribute('aria-expanded', 'false');
    }
  }

  // ==========================================================================
  // User Dropdown
  // ==========================================================================

  class UserDropdown {
    constructor() {
      this.trigger = document.querySelector('.user-trigger');
      this.dropdown = document.querySelector('.user-dropdown');
      this.isOpen = false;
      this.init();
    }

    init() {
      if (!this.trigger || !this.dropdown) return;

      this.trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (this.isOpen && !this.dropdown.contains(e.target) && e.target !== this.trigger) {
          this.close();
        }
      });

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      });
    }

    toggle() {
      this.isOpen = !this.isOpen;
      this.trigger.setAttribute('aria-expanded', this.isOpen);
      this.dropdown.style.display = this.isOpen ? 'block' : 'none';
    }

    close() {
      this.isOpen = false;
      this.trigger.setAttribute('aria-expanded', 'false');
    }
  }

  // ==========================================================================
  // Alert Auto-dismiss
  // ==========================================================================

  class AlertManager {
    constructor() {
      this.alerts = document.querySelectorAll('.alert');
      this.init();
    }

    init() {
      this.alerts.forEach(alert => {
        const dismissBtn = alert.querySelector('.alert-dismiss');
        if (dismissBtn) {
          dismissBtn.addEventListener('click', () => this.dismiss(alert));
        }

        // Auto-dismiss after 5 seconds for success/info alerts
        if (alert.classList.contains('alert-success') || alert.classList.contains('alert-info')) {
          setTimeout(() => this.dismiss(alert), 5000);
        }
      });
    }

    dismiss(alert) {
      alert.style.animation = 'slideOut 0.3s ease-in forwards';
      setTimeout(() => alert.remove(), 300);
    }
  }

  // ==========================================================================
  // Table Enhancements
  // ==========================================================================

  class TableEnhancements {
    constructor() {
      this.tables = document.querySelectorAll('.table-container table');
      this.init();
    }

    init() {
      this.tables.forEach(table => {
        // Add row hover effects
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
          row.style.cursor = 'pointer';
          row.addEventListener('click', (e) => {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
              const link = row.querySelector('a[href]');
              if (link) link.click();
            }
          });
        });

        // Add column sorting if headers have data-sort attribute
        const headers = document.querySelectorAll('th[data-sort]');
        headers.forEach(th => {
          th.style.cursor = 'pointer';
          th.addEventListener('click', () => this.sortTable(th));
        });
      });
    }

    sortTable(th) {
      const table = th.closest('table');
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const columnIndex = Array.from(th.parentNode.children).indexOf(th);
      const isAsc = !th.classList.contains('sort-asc');

      // Clear other headers
      th.parentNode.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
      });

      // Sort rows
      const sortedRows = rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent.trim();
        const bText = b.children[columnIndex].textContent.trim();
        
        const aNum = parseFloat(aText);
        const bNum = parseFloat(bText);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return aNum - bNum;
        }
        return aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' });
      });

      if (!isAsc) sortedRows.reverse();

      const tbody = table.querySelector('tbody');
      sortedRows.forEach(row => tbody.appendChild(row));

      th.classList.add(isAsc ? 'sort-asc' : 'sort-desc');
    }
  }

  // ==========================================================================
  // Form Enhancements
  // ==========================================================================

  class FormEnhancements {
    constructor() {
      this.init();
    }

    init() {
      // Auto-focus first input
      const firstInput = document.querySelector('input:not([type="hidden"]):not([type="hidden"]), select, textarea');
      if (firstInput && !document.querySelector(':focus')) {
        firstInput.focus();
      }

      // Auto-resize textareas
      document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', function() {
          this.style.height = 'auto';
          this.style.height = this.scrollHeight + 'px';
        });
      });

      // Character counter for fields with maxlength
      document.querySelectorAll('[maxlength]').forEach(input => {
        const maxLength = parseInt(input.getAttribute('maxlength'), 10);
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = 'font-size: 0.75rem; color: var(--color-gray-500); text-align: right; margin-top: 4px;';
        input.parentNode.insertBefore(counter, input.nextSibling);
        
        const updateCounter = () => {
          const remaining = maxLength - input.value.length;
          counter.textContent = `${input.value.length}/${maxLength}`;
          counter.style.color = remaining < 10 ? 'var(--color-error)' : 'var(--color-gray-500)';
        };
        
        input.addEventListener('input', updateCounter);
        updateCounter();
      });
    }
  }

  // ==========================================================================
  // Table Row Actions
  // ==========================================================================

  class TableActions {
    constructor() {
      this.init();
    }

    init() {
      // Add click-to-row navigation for tables
      document.querySelectorAll('tbody tr[data-href]').forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', (e) => {
          if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON' && 
              e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
            const href = row.dataset.href;
            if (href) window.location.href = href;
          }
        });
        
        // Keyboard support
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const link = row.querySelector('a[href]');
            if (link) link.click();
          }
        });
        
        // Add keyboard focus style
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'button');
        row.setAttribute('aria-label', 'Clique para visualizar');
      });
    }
  }

  // ==========================================================================
  // Confirmation Dialogs
  // ==========================================================================

  class ConfirmDialog {
    static confirm(message, onConfirm, onCancel) {
      const overlay = document.createElement('div');
      overlay.className = 'confirm-overlay';
      overlay.innerHTML = `
        <div class="confirm-dialog">
          <div class="confirm-header">
            <h3>Confirmar ação</h3>
          </div>
          <p>${message}</p>
          <div class="confirm-actions">
            <button type="button" class="btn btn-secondary btn-cancel">Cancelar</button>
            <button type="button" class="btn btn-danger btn-confirm">Confirmar</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(overlay);
      
      // Focus management
      const confirmBtn = overlay.querySelector('.btn-confirm');
      const cancelBtn = overlay.querySelector('.btn-cancel');
      confirmBtn.focus();
      
      const cleanup = () => {
        document.body.removeChild(overlay);
        document.removeEventListener('keydown', handleKeydown);
      };
      
      const handleKeydown = (e) => {
        if (e.key === 'Escape') {
          cleanup();
          if (onCancel) onCancel();
        }
      };
      
      overlay.querySelector('.btn-cancel').addEventListener('click', () => {
        cleanup();
        if (onCancel) onCancel();
      });
      
      overlay.querySelector('.btn-confirm').addEventListener('click', () => {
        cleanup();
        if (onConfirm) onConfirm();
      });
      
      document.addEventListener('keydown', handleKeydown);
      
      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          cleanup();
          if (onCancel) onCancel();
        }
      });
    }
  }

  // ==========================================================================
  // Search Enhancement
  // ==========================================================================

  class SearchEnhancement {
    constructor() {
      this.searchInput = document.getElementById('searchbar');
      this.init();
    }

    init() {
      if (!this.searchInput) return;

      // Add clear button
      const wrapper = this.searchInput.parentElement;
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'search-clear';
      clearBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
      clearBtn.className = 'search-clear';
      clearBtn.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:none;padding:4px;color:var(--color-gray-500);cursor:pointer;border-radius:50%;display:none;';
      clearBtn.setAttribute('aria-label', 'Limpar busca');
      
      this.searchInput.parentNode.style.position = 'relative';
      this.searchInput.parentNode.appendChild(clearBtn);

      this.searchInput.addEventListener('input', () => {
        clearBtn.style.display = this.searchInput.value ? 'flex' : 'none';
      });

      clearBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchInput.focus();
        clearBtn.style.display = 'none';
        // Trigger form submit or custom event
        const form = this.searchInput.closest('form');
        if (form) {
          const event = new Event('input', { bubbles: true });
          this.searchInput.dispatchEvent(event);
        }
      });
    }
  }

  // ==========================================================================
  // Table Row Click Navigation
  // ==========================================================================

  class TableRowNavigation {
    static init() {
      document.querySelectorAll('tbody tr[data-href]').forEach(row => {
        row.style.cursor = 'pointer';
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'button');
        row.setAttribute('aria-label', 'Clique para visualizar');
        
        row.addEventListener('click', (e) => {
          // Don't navigate if clicking on links, buttons, inputs
          if (['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
          
          const href = row.dataset.href;
          if (href) {
            window.location.href = href;
          }
        });
        
        // Keyboard support
        row.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const href = row.dataset.href;
            if (href) window.location.href = href;
          }
        });
        
        // Visual feedback
        row.style.cursor = 'pointer';
        row.setAttribute('tabindex', '0');
        row.setAttribute('role', 'button');
        row.setAttribute('aria-label', 'Clique para visualizar detalhes');
      });
    }
  }

  // ==========================================================================
  // Toggle Switches
  // ==========================================================================

  class ToggleSwitch {
    static init() {
      document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(checkbox => {
        const wrapper = document.createElement('div');
        wrapper.className = 'toggle-wrapper';
        checkbox.parentNode.insertBefore(wrapper, checkbox);
        wrapper.appendChild(checkbox);
        
        const slider = document.createElement('span');
        slider.className = 'toggle-slider';
        wrapper.appendChild(slider);
        
        checkbox.addEventListener('change', function() {
          wrapper.classList.toggle('checked', this.checked);
        });
        
        // Initialize state
        if (checkbox.checked) {
          wrapper.classList.add('checked');
        }
      });
    }
  }

  // ==========================================================================
  // Bulk Actions
  // ==========================================================================

  class BulkActions {
    static init() {
      const selectAll = document.getElementById('action-toggle');
      const rowCheckboxes = document.querySelectorAll('.action-checkbox');
      const actionSelect = document.querySelector('select[name="action"]');
      const actionSubmit = document.querySelector('button[name="index"]');
      
      if (!selectAll) return;
      
      // Select all
      selectAll.addEventListener('change', function() {
        document.querySelectorAll('.action-checkbox').forEach(cb => {
          cb.checked = selectAll.checked;
        });
        BulkActions.updateCounter();
      });
      
      // Update counter on individual checkbox change
      document.querySelectorAll('.action-checkbox').forEach(cb => {
        cb.addEventListener('change', () => {
          BulkActions.updateCounter();
        });
      });
      
      // Disable submit if no action selected
      if (actionSelect && actionSubmit) {
        actionSelect.addEventListener('change', () => {
          const hasSelection = document.querySelectorAll('.action-checkbox:checked').length > 0;
          const hasAction = actionSelect.value;
          const submitBtn = document.querySelector('button[name="index"]');
          if (submitBtn) {
            submitBtn.disabled = !(hasSelection && hasAction);
          }
        });
      }
    }
    
    static updateCounter() {
      const count = document.querySelectorAll('.action-checkbox:checked').length;
      const counter = document.getElementById('selected-count');
      if (counter) {
        counter.textContent = `${count} selecionado${count !== 1 ? 's' : ''}`;
      }
    }
  }

  // ==========================================================================
  // Keyboard Shortcuts
  // ==========================================================================

  class KeyboardShortcuts {
    static init() {
      document.addEventListener('keydown', (e) => {
        // Global shortcuts
        if (e.ctrlKey || e.metaKey) {
          switch (e.key.toLowerCase()) {
            case 'k':
              e.preventDefault();
              const searchInput = document.getElementById('searchbar');
              if (searchInput) {
                searchInput.focus();
                searchInput.select();
              }
              break;
            case 's':
              e.preventDefault();
              const saveBtn = document.querySelector('button[type="submit"][name="_save"]');
              if (saveBtn) saveBtn.click();
              break;
          }
        }
        
        // Escape to close modals/dropdowns
        if (e.key === 'Escape') {
          document.querySelectorAll('.user-dropdown, .confirm-overlay, .modal').forEach(el => {
            if (el.style.display !== 'none') {
              const closeBtn = el.querySelector('.btn-cancel, .modal-close, .alert-dismiss');
              if (closeBtn) closeBtn.click();
            }
          }
        }
      });
    }
  }

  // ==========================================================================
  // Auto-save for forms
  // ==========================================================================

  class AutoSave {
    static init(selector = 'form', interval = 30000) {
      const forms = document.querySelectorAll(selector);
      forms.forEach(form => {
        let saveTimeout;
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
          input.addEventListener('input', () => {
            clearTimeout(window.autoSaveTimeout);
            window.autoSaveTimeout = setTimeout(() => {
              // Visual indicator
              const indicator = document.createElement('div');
              indicator.className = 'autosave-indicator';
              indicator.textContent = 'Salvando automaticamente...';
              indicator.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 15px;background:var(--color-primary);color:white;border-radius:8px;z-index:1000;font-size:0.875rem;';
              document.body.appendChild(indicator);
              setTimeout(() => indicator.remove(), 2000);
            }, 2000);
          });
        });
      });
    }
  }

  // ==========================================================================
  // Initialize All Components
  // ==========================================================================

  function initAdmin() {
    // Initialize all components
    window.sidebarNav = new SidebarNavigation();
    window.userDropdown = new UserDropdown();
    window.alertManager = new AlertManager();
    window.tableEnhancements = new TableEnhancements();
    window.formEnhancements = new FormEnhancements();
    window.tableActions = TableActions.init();
    window.searchEnhancement = new SearchEnhancement();
    window.tableRowNavigation = TableRowNavigation.init();
    window.toggleSwitch = ToggleSwitch.init();
    window.bulkActions = BulkActions.init();
    KeyboardShortcuts.init();
    
    // Auto-save for forms with data-autosave attribute
    document.querySelectorAll('form[data-autosave]').forEach(form => {
      AutoSave.init(`#${form.id}`, 30000);
    });

    // Add loaded class to body for CSS animations
    document.body.classList.add('admin-loaded');
    
    console.log('CON(S)CIÊNCIA POLÍTICA Admin initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }

  // Export for global access
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
    AutoSave,
    ConfirmDialog
  };
})();