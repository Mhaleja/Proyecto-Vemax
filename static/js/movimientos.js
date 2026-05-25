/* ============================================
   movimientos.js  —  Lógica exclusiva de movimientos
   SRP: estado, render, modal, filtros, formato de monto.
   ============================================ */

/* ── ESTADO ─────────────────────────────────────────────────── */
let movimientos = [];

let filtroActivo = 'todos';
let tipoModal    = 'ingreso';

/* ── INIT ───────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('inputFecha').value = hoy();
  document.getElementById('inputMonto').addEventListener('input', maskMonto);
  document.getElementById('inputMonto').addEventListener('keydown', soloNumeros);

  movimientos = await obtenerMovimientos();
  renderizar();
});

/* ── RENDER FEED ────────────────────────────────────────────── */

function renderizar(lista = movimientos) {
  const feed  = document.getElementById('feed');
  const empty = document.getElementById('emptyState');
  feed.innerHTML = '';

  const ordenados = [...lista].sort((a,b) => new Date(b.fecha) - new Date(a.fecha));

  if (ordenados.length === 0) {
    empty.classList.remove('hidden'); empty.classList.add('flex');
  } else {
    empty.classList.add('hidden'); empty.classList.remove('flex');
    ordenados.forEach((m, i) => feed.appendChild(crearItem(m, i)));
  }

  actualizarStrip(lista);
  actualizarSubtitulo();
}

function crearItem(m, i) {
  const ing = m.tipo === 'ingreso';
  const div = document.createElement('div');
  div.className = 'tx-item flex items-center gap-3 p-3 row-in';
  div.style.animationDelay = `${i * 25}ms`;

  div.innerHTML = `
    <div class="tx-icon ${ing ? 'ing' : 'egr'}">${categoriaEmoji(m.categoria)}</div>
    <div style="flex:1;min-width:0">
      <p class="text-sm font-semibold truncate" style="color:var(--text)">${escapeHTML(m.concepto)}</p>
      <p class="text-xs mt-0.5" style="color:var(--muted)">
        ${m.categoria || 'Sin categoría'} · ${m.metodo || '—'}
        ${m.nota ? ' · <em>' + escapeHTML(m.nota) + '</em>' : ''}
      </p>
    </div>
    <div style="text-align:right;flex-shrink:0">
      <p class="text-sm font-bold" style="color:${ing ? 'var(--green)' : 'var(--red)'}">
        ${ing ? '+' : '−'} $${fmt(m.monto)}
      </p>
      <p class="text-xs mt-0.5" style="color:var(--muted)">${formatearFecha(m.fecha)}</p>
    </div>
    <button onclick="eliminar(${m.id})" title="Eliminar"
            class="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style="background:var(--primary-light)">
      <svg width="12" height="12" fill="none" stroke="var(--red)" stroke-width="2" viewBox="0 0 24 24">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
      </svg>
    </button>
  `;
  return div;
}

/* ── STRIP BALANCE ──────────────────────────────────────────── */

function actualizarStrip(lista) {
  const ingresos = lista.filter(m => m.tipo === 'ingreso').reduce((s,m) => s+m.monto, 0);
  const egresos  = lista.filter(m => m.tipo === 'egreso' ).reduce((s,m) => s+m.monto, 0);
  const neto     = ingresos - egresos;

  document.getElementById('totalIngresos').textContent = `$${fmt(ingresos)}`;
  document.getElementById('totalEgresos').textContent  = `$${fmt(egresos)}`;
  const el = document.getElementById('balanceNeto');
  el.textContent = `${neto >= 0 ? '+' : '−'} $${fmt(Math.abs(neto))}`;
}

function actualizarSubtitulo() {
  const n = movimientos.length;
  const mes = new Date().toLocaleString('es-CO', { month:'long', year:'numeric' });
  document.getElementById('subtitulo').textContent =
    `${mes.charAt(0).toUpperCase() + mes.slice(1)} · ${n} registro${n !== 1 ? 's' : ''}`;
}

/* ── FILTROS ────────────────────────────────────────────────── */

function filtrar(tipo) {
  filtroActivo = tipo;

  // Estilos de pills
  const clases = { todos:'sel-todos', ingreso:'sel-ingreso', egreso:'sel-egreso' };
  ['todos','ingreso','egreso'].forEach(t => {
    const btn = document.getElementById(`f-${t}`);
    btn.className = `f-pill ${t === tipo ? clases[t] : 'idle'}`;
  });

  const q = (document.getElementById('buscador').value || '').toLowerCase();
  const resultado = movimientos.filter(m => {
    const matchTipo = tipo === 'todos' || m.tipo === tipo;
    const matchQ    = !q || m.concepto.toLowerCase().includes(q) || (m.nota || '').toLowerCase().includes(q);
    return matchTipo && matchQ;
  });

  renderizar(resultado);
}

/* ── MODAL ──────────────────────────────────────────────────── */

function abrirModal(tipo) {
  cambiarTipo(tipo);
  limpiarModal();
  document.getElementById('modal-overlay').classList.add('open');
  setTimeout(() => document.getElementById('inputMonto').focus(), 220);
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}

function cerrarSiOverlay(e) {
  if (e.target === document.getElementById('modal-overlay')) cerrarModal();
}

function cambiarTipo(tipo) {
  tipoModal = tipo;
  const ing = tipo === 'ingreso';

  document.getElementById('tabIng').className = `tipo-tab ${ing ? 'ing' : 'inactive'}`;
  document.getElementById('tabEgr').className = `tipo-tab ${!ing ? 'egr' : 'inactive'}`;
  document.getElementById('modalSub').textContent  = ing ? 'Registra un ingreso de dinero' : 'Registra un gasto o salida';
  document.getElementById('btnGuardar').textContent = ing ? 'Guardar ingreso' : 'Guardar egreso';
  document.getElementById('btnGuardar').style.background = ing ? 'var(--primary)' : '#EF4444';
  document.getElementById('signoMonto').textContent = ing ? '+' : '−';
  document.getElementById('signoMonto').style.color  = ing ? 'var(--green)' : 'var(--red)';
}

function limpiarModal() {
  document.getElementById('inputMonto').value    = '';
  document.getElementById('inputConcepto').value = '';
  document.getElementById('inputCategoria').value= '';
  document.getElementById('inputMetodo').value   = '';
  document.getElementById('inputFecha').value    = hoy();
  document.getElementById('inputNota').value     = '';
}

/* ── GUARDAR ────────────────────────────────────────────────── */

async function guardarMovimiento() {
  const montoRaw = document.getElementById('inputMonto').value.replace(/\./g,'');
  const monto    = parseFloat(montoRaw);
  const concepto = document.getElementById('inputConcepto').value.trim();
  const fecha    = document.getElementById('inputFecha').value;

  if (!monto || monto <= 0) { showToast('Ingresa un monto válido'); return; }
  if (!concepto)            { showToast('Escribe un concepto');      return; }
  if (!fecha)               { showToast('Selecciona una fecha');     return; }

  const nuevo = {
    id:        Date.now(),
    tipo:      tipoModal,
    concepto,
    monto,
    categoria: document.getElementById('inputCategoria').value || 'Otros',
    metodo:    document.getElementById('inputMetodo').value    || 'Efectivo',
    fecha,
    nota:      document.getElementById('inputNota').value.trim(),
  };

  const movimientoGuardado = await agregarMovimiento(nuevo);

  if (!movimientoGuardado) {
    showToast('No se pudo guardar el movimiento');
    return;
  }

  movimientos = await obtenerMovimientos();

  cerrarModal();
  filtrar(filtroActivo);
  showToast(`${tipoModal === 'ingreso' ? 'Ingreso' : 'Egreso'} guardado ✓`);
}

/* ── ELIMINAR ───────────────────────────────────────────────── */

async function eliminar(id) {
  eliminarMovimiento(id);
  movimientos = await obtenerMovimientos();
  /* await eliminarMovimientoAPI(id); */
  filtrar(filtroActivo);
  showToast('Movimiento eliminado');
}

/* ── MÁSCARA DE MONTO ───────────────────────────────────────── */

/**
 * soloNumeros(e)
 * Bloquea cualquier tecla que no sea dígito, Backspace, Delete, Tab, flechas.
 * Previene que el usuario pegue letras.
 */
function soloNumeros(e) {
  const permitidas = ['Backspace','Delete','Tab','ArrowLeft','ArrowRight','Home','End'];
  if (permitidas.includes(e.key)) return;
  if (e.ctrlKey || e.metaKey)     return; // Ctrl+C, Ctrl+V, etc.
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

/**
 * maskMonto()
 * Lee el valor raw, elimina lo que no sea dígito,
 * aplica puntos de miles y actualiza el campo.
 * Ejemplo: el usuario escribe 1500000 → se muestra 1.500.000
 */
function maskMonto() {
  const input   = document.getElementById('inputMonto');
  const solo    = input.value.replace(/\D/g, '');          // solo dígitos
  const numero  = parseInt(solo || '0', 10);
  const formateado = numero === 0 ? '' : numero.toLocaleString('es-CO'); // puntos de miles
  // Guardar posición del cursor
  const fin = formateado.length;
  input.value = formateado;
  input.setSelectionRange(fin, fin);
}

/* ── HELPERS ────────────────────────────────────────────────── */

function hoy() {
  return new Date().toISOString().split('T')[0];
}

function fmt(n) {
  return Number(n).toLocaleString('es-CO', { minimumFractionDigits:0 });
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function categoriaEmoji(cat) {
  return { Alimentación:'🍽', Transporte:'🚌', Estudios:'📚', Salud:'💊',
           Entretenimiento:'🎮', Trabajo:'💼', Familia:'🏠', Otros:'📦' }[cat] || '📦';
}

window.abrirModal = abrirModal;
window.cerrarModal = cerrarModal;
window.cerrarSiOverlay = cerrarSiOverlay;
window.cambiarTipo = cambiarTipo;
window.guardarMovimiento = guardarMovimiento;
window.eliminar = eliminar;
window.filtrar = filtrar;