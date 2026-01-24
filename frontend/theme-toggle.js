/**
 * EcoLife Theme Toggle – Stable & Clean
 */
function getToggleBtn() {
  return document.getElementById('themeToggle');
}

(function () {
  'use strict';

  const THEME_KEY = 'ecolife-theme';
  const LIGHT = 'light';
  const DARK = 'dark';

  const root = document.documentElement;

  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === LIGHT || saved === DARK) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function applyTheme(theme, animate = false) {
    if (![LIGHT, DARK].includes(theme)) theme = LIGHT;

    if (animate) {
      root.classList.add('theme-transitioning');
      setTimeout(() => root.classList.remove('theme-transitioning'), 400);
    }

    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateIcon(theme);
  }

  function updateIcon(theme) {
    const toggleBtn = getToggleBtn();
if (!toggleBtn) return;
const icon = toggleBtn.querySelector('i');

    if (!icon) return;

    icon.classList.remove('fa-sun', 'fa-moon');
    icon.classList.add(theme === DARK ? 'fa-sun' : 'fa-moon');

    toggleBtn.setAttribute(
      'aria-label',
      theme === DARK ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || LIGHT;
    applyTheme(current === DARK ? LIGHT : DARK, true);
    console.log("🌗 Theme toggle clicked");

  }

  // INITIAL APPLY (no animation)
  const initialTheme = getSavedTheme();
  root.setAttribute('data-theme', initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateIcon(initialTheme);

    document.addEventListener('click', (e) => {
  const btn = e.target.closest('#themeToggle');
  if (btn) toggleTheme();
});

  });
})();