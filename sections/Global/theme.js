// ── THEME TOGGLE ─────────────────────────────────────────────
(function () {
  const STORAGE_KEY = 'jk-theme';
  const root = document.documentElement;

  // Apply saved or system-preferred theme before paint (no flash)
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');
  root.setAttribute('data-theme', initialTheme);

  window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    // Set initial visual state
    updateToggle(btn, root.getAttribute('data-theme'));

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(STORAGE_KEY, next);
      updateToggle(btn, next);

      // Ripple animation on switch
      btn.classList.add('theme-toggle--switching');
      setTimeout(() => btn.classList.remove('theme-toggle--switching'), 400);
    });
  });

  function updateToggle(btn, theme) {
    const isDark = theme === 'dark';
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    // Update icon visibility
    const sunIcon = btn.querySelector('.theme-icon-sun');
    const moonIcon = btn.querySelector('.theme-icon-moon');
    const label = btn.querySelector('.theme-label');
    if (sunIcon) sunIcon.style.opacity = isDark ? '0' : '1';
    if (moonIcon) moonIcon.style.opacity = isDark ? '1' : '0';
    if (label) label.textContent = isDark ? 'Light' : 'Dark';
  }
})();
