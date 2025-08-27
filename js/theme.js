// js/theme.js
(function () {
  const STORAGE_KEY = "theme"; // "light" | "dark"

  function getStoredTheme() {
    const t = localStorage.getItem(STORAGE_KEY);
    return t === "dark" ? "dark" : "light";
  }

  function setStoredTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    // Atualiza rótulo do botão, se existir
    const btn = document.getElementById("themeToggle");
    if (btn) btn.textContent = theme === "dark" ? "Tema Claro" : "Tema Escuro";
  }

  function toggleTheme() {
    const current = getStoredTheme();
    const next = current === "dark" ? "light" : "dark";
    setStoredTheme(next);
    applyTheme(next);
  }

  // Inicializa (aplica o tema salvo)
  function initTheme() {
    applyTheme(getStoredTheme());
  }

  // Se existir o botão #themeToggle na página, conecta o evento
  function initToggleButton() {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", toggleTheme);
    // Ajusta o rótulo inicial
    applyTheme(getStoredTheme());
  }

  // Sincroniza entre abas e entre páginas
  window.addEventListener("storage", (e) => {
    if (e.key === STORAGE_KEY) {
      applyTheme(getStoredTheme());
    }
  });

  // Exponha funções mínimas (caso precise)
  window.__Theme = { initTheme, toggleTheme, applyTheme };

  // Auto-init ao carregar
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initToggleButton();
  });
})();
