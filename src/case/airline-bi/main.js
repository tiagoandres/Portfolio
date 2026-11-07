import { inject } from '@vercel/analytics';
import '../../index.css';
import './case.css';

const root = document.documentElement;
const store = (k, v) => { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } };

document.getElementById('lang-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-lang') === 'en' ? 'es' : 'en';
  root.setAttribute('data-lang', next);
  root.lang = next;
  store('portfolio_lang', next.toUpperCase());
});

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  store('portfolio_theme', next);
});

// Keep in sync when the portfolio (parent window) changes language or theme.
window.addEventListener('storage', (e) => {
  if (e.key === 'portfolio_lang' && e.newValue) {
    const l = e.newValue === 'EN' ? 'en' : 'es';
    root.setAttribute('data-lang', l);
    root.lang = l;
  }
  if (e.key === 'portfolio_theme' && e.newValue) root.setAttribute('data-theme', e.newValue);
});

// Inside the portfolio's viewer the page is framed: hide its own top bar.
if (window.self !== window.top) root.classList.add('is-framed');

inject();
