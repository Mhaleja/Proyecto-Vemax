/* ============================================
   FinSet Dashboard — Lógica y conexión con API
   ============================================ */

// SRP:
// Este archivo se encarga de manejar la logica del dashboard:
// tema, datos, graficos, tablas, metas y notificaciones.
// Aunque podria dividirse en mas archivos, por ahora se mantiene junto
// para no romper la conexion actual del frontend.


// DIP:
// Centralizamos la ruta base de la API en una sola constante,
// asi las funciones no dependen de una URL escrita manualmente en cada parte.
const API_BASE = window.location.origin + '/api';

// ============================================
// UTILIDADES
// ============================================

// SRP:
// Esta funcion solo muestra mensajes temporales en pantalla.

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('opacity-0', 'pointer-events-none');
  t.classList.add('opacity-100');
  setTimeout(() => {
    t.classList.remove('opacity-100');
    t.classList.add('opacity-0', 'pointer-events-none');
  }, 3000);
}

// SRP:
// Esta funcion solo formatea numeros para mostrarlos en la interfaz.

function formatNum(n) {
  return Number(n).toLocaleString('en-US');
}

// ============================================
// CAPA DE DATOS  —  fetchAPI con fallback
// ============================================

// DIP:
// Esta funcion centraliza las llamadas a la API,
// si despues cambia el backend, se modifica aqui y no en cada grafico o tabla.

async function fetchAPI(endpoint, fallback) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`[FinSet] Usando datos de ejemplo para ${endpoint}:`, e.message);
    return fallback;
  }
}

// ============================================
// DATOS DE EJEMPLO
// ============================================

// OCP:
// Estos datos de ejemplo permiten que el dashboard siga funcionando
// aunque el backend todavia no tenga esos endpoints listos.

const MOCK = {
  summary: {
    user: { name: 'Adaline', full_name: 'Adaline Lively', email: 'adalineal@gmail.com' },
    balance: 200700, income: 350000, expense: 100000, savings: 154700,
    balance_change: 12.1, income_change: 6.3, expense_change: 2.4, savings_change: 12.1,
  },
  moneyFlow: {
    labels:  ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
    income:  [6500, 7200, 10000, 8100, 7400, 8900, 8500],
    expense: [3200, 4100, 5500,  4800, 3900, 5200, 6222],
  },
  budget: {
    total: 120950,
    categories: [
      { name: 'Ocio', amount: 420,  color: '#62afe6', pct: 7  },
      { name: 'Hogar',       amount: 600,  color: '#3d8fc7', pct: 10 },
      { name: 'Transporte',           amount: 1500, color: '#89c7f0', pct: 25 },
      { name: 'Alimentación',      amount: 1800, color: '#a8d8f5', pct: 30 },
      { name: 'Recursos',               amount: 800,  color: '#383939', pct: 14 },
    ],
  },
  transactions: [
    { date: '25 Jul 12:30', amount: -5000,  name: 'Perro del Exito',  method: 'Efectivo',          category: 'Alimentación' },
    { date: '26 Jul 15:00', amount: -52000, name: 'Botella de Ron', method: 'Tarjeta',           category: 'Ocio'     },
    { date: '27 Jul 09:00', amount: -14000,  name: 'Juguete Mascota', method: 'Tarjeta',           category: 'Hogar' },
    { date: '27 Jul 18:00', amount: -10000,  name: 'Dulces Variados',   method: 'Transferencia',     category: 'Alimentación'     },
    { date: '28 Jul 10:00', amount: -35000,  name: 'Transmilenio',  method: 'Efectivo',          category: 'Transporte' },
  ],
  goals: [
    { name: 'Concierto BTS', current: 125000,  target: 500000,   pct: 25 },
    { name: 'Regalo Papá',  current: 25200, target: 60000,  pct: 42 },
    { name: 'Limpieza Dental',  current: 4500,  target: 150000, pct: 3  },
  ],
};

// ============================================
// RENDERIZADO
// ============================================

// ── 1. Tarjetas de resumen ──
// SRP:
// Esta funcion solo carga y muestra las tarjetas principales del resumen.

async function loadSummary() {
  console.log('Cargando resumen desde movimientos');
  const movimientos = await obtenerMovimientos();
  const d = calcularResumenFinanciero(movimientos);

  document.getElementById('totalBalance').textContent = formatNum(d.balance);
  document.getElementById('totalIncome').textContent  = formatNum(d.income);
  document.getElementById('totalExpense').textContent = formatNum(d.expense);
  document.getElementById('totalSavings').textContent = formatNum(d.savings);

  setBadge('balanceBadge', 0);
  setBadge('incomeBadge',  0);
  setBadge('expenseBadge', 0, true);
  setBadge('savingsBadge', 0);
}

// SRP:
// Esta funcion solo configura el badge de porcentaje.

function setBadge(id, pct, invertColor = false) {
  const el    = document.getElementById(id);
  const isPos = pct >= 0;
  const good  = invertColor ? !isPos : isPos;
  el.textContent = `${isPos ? '↑' : '↓'} ${Math.abs(pct)}%`;
  el.className   = `text-xs px-2 py-0.5 rounded-full font-medium ${good ? 'badge-green' : 'badge-red'}`;
}

// ── 2. Gráfico de barras (flujo de dinero) ──
let moneyChart;

// SRP:
// Esta funcion solo carga y renderiza el grafico semanal de ingresos y gastos.

async function loadMoneyFlow() {
  const movimientos = await obtenerMovimientos();
  const d = calcularFlujoSemanal(movimientos);
  const ctx = document.getElementById('moneyFlowChart').getContext('2d');
  const isDark = document.documentElement.classList.contains('dark');

  if (moneyChart) moneyChart.destroy();

  moneyChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        {
          label: 'Ingresos',
          data: d.income,
          backgroundColor: '#62afe6',   /* celeste */
          borderRadius: 6,
          barPercentage: 0.45,
        },
        {
          label: 'Gastos',
          data: d.expense,
          backgroundColor: 'rgba(56,57,57,0.5)',  /* gris oscuro semitransparente */
          borderRadius: 6,
          barPercentage: 0.45,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#383939',
          titleFont: { family: 'Sora' },
          bodyFont:  { family: 'Sora' },
          callbacks: { label: c => ` $${formatNum(c.raw)}` },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { family: 'Sora', size: 11 }, color: isDark ? '#5a7f99' : '#7a9bb5' },
        },
        y: {
          grid: { color: isDark ? '#1e3347' : '#e8f5fd' },
          ticks: {
            font: { family: 'Sora', size: 11 },
            color: isDark ? '#5a7f99' : '#7a9bb5',
            callback: v => '$' + formatNum(v),
          },
        },
      },
    },
  });
}

// ── 3. Gráfico donut (presupuesto) ──

// SRP:
// Esta funcion solo carga y renderiza el grafico mensual de presupuesto.

let budgetChart;

async function loadBudget() {
  const movimientos = await obtenerMovimientos();
  const d = calcularPresupuestoPorCategoria(movimientos);

  const ctx = document.getElementById('budgetChart').getContext('2d');
  if (budgetChart) budgetChart.destroy();
  if (d.categories.length === 0) {
    d.categories = [
      { name: 'Sin gastos', amount: 1, color: '#d6eaf8', pct: 100 }
    ];
  }
  document.getElementById('budgetTotal').textContent = '$' + formatNum(d.total);

  budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: d.categories.map(c => c.name),
      datasets: [{
        data:            d.categories.map(c => c.pct),
        backgroundColor: d.categories.map(c => c.color),
        borderWidth: 0,
        hoverOffset: 4,
      }],
    },
    options: {
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#383939',
          callbacks: { label: c => ` ${c.label}: ${c.raw}%` },
        },
      },
    },
  });

  const leg = document.getElementById('budgetLegend');
  leg.innerHTML = d.categories.map(c => `
    <div class="flex items-center gap-1.5">
      <span class="w-2 h-2 rounded-full flex-shrink-0" style="background:${c.color}"></span>
      <span style="color:var(--muted)">${c.name}</span>
    </div>
  `).join('');
}

// ── 4. Tabla de transacciones ──
const CATEGORY_ICONS = {
  'Recursos':    '💡',
  'Ocio':        '📱',
  'Alimentación':'🍽️',
  'Hogar':       '🏘️',
  'Transporte':  '🛣️',
};

// SRP:
// Esta funcion solo carga y muestra la tabla de transacciones.

async function loadTransactions() {
  const movimientos = await obtenerMovimientos();

  const list = movimientos
    .slice()
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5);

  const tbody = document.getElementById('transactionsBody');

  tbody.innerHTML = list.map(t => {
    const amount = t.tipo === 'ingreso' ? Number(t.monto) : -Number(t.monto);
    const isPos = amount >= 0;
    const color = isPos ? 'var(--green)' : 'var(--red)';
    const sign = isPos ? '+' : '-';
    const icon = CATEGORY_ICONS[t.categoria] || '💸';

    return `
      <tr class="border-t hover:bg-gray-50 transition-colors" style="border-color:var(--border)">
        <td class="py-3 text-xs" style="color:var(--muted)">${t.fecha}</td>
        <td class="py-3 text-sm font-semibold" style="color:${color}">
          ${sign}$${formatNum(Math.abs(amount))}
        </td>
        <td class="py-3">
          <div class="flex items-center gap-2">
            <span class="text-lg leading-none">${icon}</span>
            <span class="text-sm font-medium" style="color:var(--text)">${t.concepto}</span>
          </div>
        </td>
        <td class="py-3 text-xs hidden md:table-cell" style="color:var(--muted)">${t.metodo}</td>
        <td class="py-3 hidden md:table-cell">
          <span class="text-xs px-2 py-1 rounded-lg font-medium"
                style="background:var(--primary-light);color:var(--primary)">
            ${t.categoria}
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// ── 5. Metas de ahorro ──

// SRP:
// Esta funcion solo carga y muestra las metas de ahorro.

async function loadGoals() {
  const goals     = await fetchAPI('/goals', MOCK.goals);
  const container = document.getElementById('savingGoals');

  container.innerHTML = goals.map(g => `
    <div>
      <div class="flex justify-between mb-1.5">
        <span class="text-sm font-medium" style="color:var(--text)">${g.name}</span>
        <span class="text-sm font-semibold" style="color:var(--primary)">$${formatNum(g.target)}</span>
      </div>
      <div class="h-2 rounded-full mb-1" style="background:var(--primary-light)">
        <div class="progress-bar h-2" style="width:${g.pct}%"></div>
      </div>
      <p class="text-xs font-semibold" style="color:var(--primary)">${g.pct}%</p>
    </div>
  `).join('');
}

// ============================================
// INICIALIZACIÓN
// ============================================

// SRP:
// Esta funcion inicializa todas las partes del dashboard.

async function init() {
  await Promise.all([
    loadSummary(),
    loadMoneyFlow(),
    loadBudget(),
    loadTransactions(),
    loadGoals(),
  ]);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[data-theme="light"]')
    ?.addEventListener('click', () => setTheme('light'));

  document.querySelector('[data-theme="dark"]')
    ?.addEventListener('click', () => setTheme('dark'));

  init();
  setInterval(init, 60_000);
});
