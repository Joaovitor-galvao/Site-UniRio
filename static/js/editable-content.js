// CON(S)CIÊNCIA POLÍTICA — conteúdo das páginas controlado pelo Django Admin.
(function () {
  'use strict';

  const API = '/api/editable-content/';
  const RAW_PAGE = window.location.pathname || '/';
  const PAGE = RAW_PAGE === '/index.html' ? '/' : RAW_PAGE;

  const selector = [
    'h1','h2','h3','h4','h5','h6','p','li','blockquote','cite','td','th','caption','time',
    'span','strong','em','div','img'
  ].join(',');

  function isManaged(el) {
    return !!el.closest('[data-django-managed="true"], script, style, noscript');
  }

  function significant(el) {
    if (el.tagName === 'IMG') return !!el.getAttribute('src');
    return (el.textContent || '').trim().length >= 2;
  }

  function stableKey(el) {
    if (el.dataset.editKey) return el.dataset.editKey;
    const parts = [];
    let node = el;
    while (node && node !== document.body) {
      let part = node.tagName.toLowerCase();
      if (node.id) {
        part += '#' + node.id;
        parts.unshift(part);
        break;
      }
      const parent = node.parentElement;
      if (parent) {
        const peers = Array.from(parent.children).filter(x => x.tagName === node.tagName);
        if (peers.length > 1) part += ':nth-of-type(' + (peers.indexOf(node) + 1) + ')';
      }
      parts.unshift(part);
      node = parent;
    }
    return parts.join('>');
  }

  function editableElements() {
    const containerTags = 'p,h1,h2,h3,h4,h5,h6,li,blockquote,cite,td,th,caption,time';
    return Array.from(document.querySelectorAll(selector)).filter(el => {
      if (isManaged(el) || !significant(el)) return false;
      if (el.tagName === 'DIV' && el.children.length > 0) return false;
      if (el.tagName === 'LI' && el.querySelector('a,button,input,select,textarea')) return false;
      if (['SPAN','STRONG','EM'].includes(el.tagName) && el.parentElement && el.parentElement.closest(containerTags)) return false;
      return true;
    });
  }

  function applyTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    const vars = {
      '--page-background': theme.background,
      '--page-surface': theme.surface,
      '--page-text': theme.text,
      '--page-primary': theme.primary,
      '--page-secondary': theme.secondary,
      '--page-dark': theme.dark,
      '--page-light': theme.light
    };
    Object.entries(vars).forEach(([name, value]) => {
      if (value) root.style.setProperty(name, value);
    });
    if (theme.custom_css) {
      const style = document.createElement('style');
      style.id = 'page-admin-custom-css';
      style.textContent = theme.custom_css;
      document.head.appendChild(style);
    }
  }

  function applyContent(content) {
    editableElements().forEach(el => {
      const entry = content[stableKey(el)];
      if (!entry || typeof entry.value !== 'string') return;
      if (el.tagName === 'IMG' || entry.kind === 'image') {
        el.src = entry.value;
      } else {
        el.innerHTML = entry.value;
      }
    });
  }

  async function load() {
    try {
      const response = await fetch(API + '?page=' + encodeURIComponent(PAGE), {
        credentials: 'same-origin',
        headers: {'Accept': 'application/json'}
      });
      if (!response.ok) return;
      const data = await response.json();
      applyTheme(data.theme);
      applyContent(data.content || {});
    } catch (err) {
      console.warn('Conteúdo administrável indisponível:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load, {once: true});
  } else {
    load();
  }
})();
