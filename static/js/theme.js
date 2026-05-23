// ============================================
// TEMA — Modo claro / oscuro
// ============================================

// SRP:
// Esta funcion solo se encarga de cambiar el tema claro u oscuro.
function setTheme(mode) {
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  localStorage.setItem('theme', mode);
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);

  document.querySelector('[data-theme="light"]')
    ?.addEventListener('click', () => setTheme('light'));

  document.querySelector('[data-theme="dark"]')
    ?.addEventListener('click', () => setTheme('dark'));
}

document.addEventListener('DOMContentLoaded', initTheme);