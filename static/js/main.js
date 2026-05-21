
// ── Datos del mini gráfico de barras ──────
const chartData = [
  { income: 35, expense: 28 },
  { income: 42, expense: 30 },
  { income: 30, expense: 22 },
  { income: 50, expense: 38 },
  { income: 55, expense: 40 },
  { income: 45, expense: 32 },
];

/**
 * Renderiza las barras del mini gráfico
 * dentro de #mini-chart
 */
function renderMiniChart() {
  const container = document.getElementById('mini-chart');
  if (!container) return;

  container.innerHTML = chartData
    .map(({ income, expense }) => `
      <div class="bar-group">
        <div class="bar bar-income"  style="height:${income}px"></div>
        <div class="bar bar-expense" style="height:${expense}px"></div>
      </div>
    `)
    .join('');
}

function handleStart() {
    window.location.href = "/registro";
}

function handleLogin() {
    window.location.href = "/registro";
}
// ── Hover suave en feature pills ──────────
function initPillHovers() {
  document.querySelectorAll('.feature-pill').forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      pill.style.color = 'var(--blue-deep)';
    });
    pill.addEventListener('mouseleave', () => {
      pill.style.color = '';
    });
  });
}

// ── Inicialización ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderMiniChart();
  initPillHovers();

  document.getElementById('btn-start')?.addEventListener('click', handleStart);
  document.getElementById('btn-login')?.addEventListener('click', handleLogin);
});
