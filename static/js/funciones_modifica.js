/* ============================================
   modificar-metas.js
   3 módulos independientes (SOLID):
     1. GoalsStore   — datos y persistencia
     2. AddModule    — agregar meta
     3. DeleteModule — eliminar meta
     4. EditModule   — modificar meta
     5. TabsModule   — navegación entre tabs
   ============================================ */

// ============================================
// 1. GoalsStore — fuente única de verdad
// ============================================
const GoalsStore = (() => {

  const DEFAULT = [
    { id: 1, name: 'Concierto BTS',  target: 500000, current: 125000, pct: 25, start: '', end: '' },
    { id: 2, name: 'Regalo Papá',    target: 60000,  current: 25200,  pct: 42, start: '2025-05-15', end: '2025-05-30' },
    { id: 3, name: 'Limpieza Dental',target: 150000, current: 4500,   pct: 3,  start: '', end: '' },
  ];

  function load() {
    try {
      return JSON.parse(localStorage.getItem('finset_goals')) || DEFAULT;
    } catch { return DEFAULT; }
  }

  function save(goals) {
    localStorage.setItem('finset_goals', JSON.stringify(goals));
  }

  function getAll()    { return load(); }
  function nextId()    { const g = load(); return g.length ? Math.max(...g.map(x => x.id)) + 1 : 1; }

  function add(goal) {
    const goals = load();
    goals.push({ ...goal, id: nextId() });
    save(goals);
  }

  function remove(id) {
    save(load().filter(g => g.id !== id));
  }

  function update(id, changes) {
    save(load().map(g => g.id === id ? { ...g, ...changes } : g));
  }

  return { getAll, add, remove, update };
})();

// ============================================
// UTILIDADES compartidas
// ============================================
function formatNum(n)  { return Number(n).toLocaleString('en-US'); }
function calcPct(c, t) { return t ? Math.min(100, Math.round((c / t) * 100)) : 0; }

function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.background = isError ? '#EF4444' : 'var(--primary)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return `${parseInt(day)} ${meses[parseInt(m)-1]}`;
}

// ============================================
// 2. AddModule — agregar nueva meta
// ============================================
const AddModule = (() => {

  // Estado local del módulo
  const state = { name:'', target:0, current:0, start:'', end:'' };

  function updatePreview() {
    const pct = calcPct(state.current, state.target);
    document.getElementById('add-previewName').textContent    = state.name    || 'Nombre de tu meta';
    document.getElementById('add-previewTarget').textContent  = state.target  ? '$' + formatNum(state.target)  : '$0';
    document.getElementById('add-previewCurrent').textContent = '$' + formatNum(state.current) + ' ahorrado';
    document.getElementById('add-previewBar').style.width     = pct + '%';
    document.getElementById('add-previewPct').textContent     = pct + '%';
  }

  function init() {
    document.getElementById('add-name').addEventListener('input', e => {
      state.name = e.target.value.trim();
      updatePreview();
    });
    document.getElementById('add-target').addEventListener('input', e => {
      state.target  = parseFloat(e.target.value) || 0;
      if (state.current > state.target) {
        state.current = state.target;
        document.getElementById('add-current').value = state.current || '';
      }
      updatePreview();
    });
    document.getElementById('add-current').addEventListener('input', e => {
      state.current = Math.max(0, parseFloat(e.target.value) || 0);
      updatePreview();
    });
    document.getElementById('add-start').addEventListener('change', e => { state.start = e.target.value; });
    document.getElementById('add-end').addEventListener('change',   e => { state.end   = e.target.value; });
    updatePreview();
  }

  function changeAmount(delta) {
    state.current = Math.max(0, Math.min(state.target || Infinity, state.current + delta));
    document.getElementById('add-current').value = state.current || '';
    updatePreview();
  }

  function submit() {
    if (!state.name)            return showToast('Escribe un nombre para la meta', true);
    if (!state.target || state.target <= 0) return showToast('El monto objetivo debe ser mayor a 0', true);
    if (state.start && state.end && state.start > state.end)
      return showToast('La fecha inicio no puede ser mayor al fin', true);

    GoalsStore.add({
      name:    state.name,
      target:  state.target,
      current: state.current,
      pct:     calcPct(state.current, state.target),
      start:   state.start,
      end:     state.end,
    });

    // Resetea el formulario
    ['add-name','add-target','add-current','add-start','add-end']
      .forEach(id => document.getElementById(id).value = '');
    Object.assign(state, { name:'', target:0, current:0, start:'', end:'' });
    updatePreview();

    showToast('Meta agregada correctamente');
    // Refresca los selects de los otros módulos
    DeleteModule.refresh();
    EditModule.refresh();
  }

  return { init, changeAmount, submit };
})();

// ============================================
// 3. DeleteModule — eliminar meta
// ============================================
const DeleteModule = (() => {

  let selectedId = null;

  function refresh() {
    const goals     = GoalsStore.getAll();
    const container = document.getElementById('delete-list');
    container.innerHTML = '';
    document.getElementById('delete-confirm-box').classList.remove('visible');
    selectedId = null;

    if (!goals.length) {
      container.innerHTML = `<p style="color:var(--muted);font-size:13px;text-align:center;padding:12px 0">
        No hay metas guardadas</p>`;
      return;
    }

    goals.forEach(g => {
      const div = document.createElement('div');
      div.className = 'goal-option';
      div.dataset.id = g.id;
      div.innerHTML = `
        <span class="material-symbols-rounded" style="font-size:20px;color:var(--muted)">savings</span>
        <div class="flex-1">
          <p style="font-size:13px;font-weight:600;color:var(--text)">${g.name}</p>
          <p style="font-size:11px;color:var(--muted)">$${formatNum(g.target)} — ${g.pct}% completado</p>
        </div>`;
      div.addEventListener('click', () => selectGoal(g.id));
      container.appendChild(div);
    });
  }

  function selectGoal(id) {
    selectedId = id;
    document.querySelectorAll('#delete-list .goal-option')
      .forEach(el => el.classList.toggle('selected-del', parseInt(el.dataset.id) === id));
    document.getElementById('delete-confirm-box').classList.add('visible');
  }

  function confirmDelete() {
    if (!selectedId) return;
    const g = GoalsStore.getAll().find(x => x.id === selectedId);
    GoalsStore.remove(selectedId);
    showToast(`"${g.name}" eliminada`);
    refresh();
    EditModule.refresh();
  }

  function cancelDelete() {
    document.getElementById('delete-confirm-box').classList.remove('visible');
    document.querySelectorAll('#delete-list .goal-option')
      .forEach(el => el.classList.remove('selected-del'));
    selectedId = null;
  }

  return { refresh, confirmDelete, cancelDelete };
})();

// Helper: muestra u oculta el formulario de edición sin conflictos con Tailwind
function showEditForm(visible) {
  const form = document.getElementById('edit-form');
  if (!form) return;
  // Fuerza el display directamente — más fuerte que cualquier clase CSS
  form.setAttribute('style', visible
    ? 'display:block !important; animation: fadeIn 0.25s ease'
    : 'display:none !important');
}

// ============================================
// 4. EditModule — modificar meta existente
// ============================================
const EditModule = (() => {

  let selectedGoal = null;

  function refresh() {
    const goals     = GoalsStore.getAll();
    const select    = document.getElementById('edit-select');
    select.innerHTML = '<option value=""> Elige una meta </option>';
    goals.forEach(g => {
      const opt = document.createElement('option');
      opt.value       = g.id;
      opt.textContent = `${g.name} ($${formatNum(g.target)})`;
      select.appendChild(opt);
    });
    showEditForm(false);
    selectedGoal = null;
  }

  function onSelect(id) {
    if (!id) { showEditForm(false); return; }

    // Compara como string y como número para cubrir ambos casos
    selectedGoal = GoalsStore.getAll().find(g => String(g.id) === String(id));

    if (!selectedGoal) {
      console.warn('[EditModule] meta no encontrada con id:', id);
      return;
    }

    document.getElementById('edit-name').value    = selectedGoal.name;
    document.getElementById('edit-target').value  = selectedGoal.target;
    document.getElementById('edit-current').value = selectedGoal.current;
    document.getElementById('edit-start').value   = selectedGoal.start || '';
    document.getElementById('edit-end').value     = selectedGoal.end   || '';

    showEditForm(true);
    updatePreview();
  }

  function updatePreview() {
    if (!selectedGoal) return;
    const current = parseFloat(document.getElementById('edit-current').value) || 0;
    const target  = parseFloat(document.getElementById('edit-target').value)  || selectedGoal.target;
    const pct     = calcPct(current, target);
    const start   = document.getElementById('edit-start').value;
    const end     = document.getElementById('edit-end').value;

    document.getElementById('edit-previewName').textContent    = document.getElementById('edit-name').value || selectedGoal.name;
    document.getElementById('edit-previewTarget').textContent  = '$' + formatNum(target);
    document.getElementById('edit-previewCurrent').textContent = '$' + formatNum(current) + ' ahorrado';
    document.getElementById('edit-previewBar').style.width     = pct + '%';
    document.getElementById('edit-previewPct').textContent     = pct + '%';

    // Fechas en el preview
    const datesEl = document.getElementById('edit-previewDates');
    if (datesEl) {
      if (start && end) {
        datesEl.textContent = formatDate(start) + '  →  ' + formatDate(end);
        datesEl.style.display = 'flex';
      } else if (start) {
        datesEl.textContent = 'Desde ' + formatDate(start);
        datesEl.style.display = 'flex';
      } else {
        datesEl.style.display = 'none';
      }
    }
  }

  function changeAmount(delta) {
    const input  = document.getElementById('edit-current');
    const target = parseFloat(document.getElementById('edit-target').value) || Infinity;
    input.value  = Math.max(0, Math.min(target, (parseFloat(input.value) || 0) + delta));
    updatePreview();
  }

  function submit() {
    if (!selectedGoal) return showToast('Elige una meta primero', true);

    const name    = document.getElementById('edit-name').value.trim();
    const target  = parseFloat(document.getElementById('edit-target').value);
    const current = parseFloat(document.getElementById('edit-current').value) || 0;
    const start   = document.getElementById('edit-start').value;
    const end     = document.getElementById('edit-end').value;

    if (!name)             return showToast('El nombre no puede estar vacío', true);
    if (!target || target <= 0) return showToast('El monto objetivo debe ser mayor a 0', true);
    if (current > target)  return showToast('El monto actual no puede superar el objetivo', true);
    if (start && end && start > end) return showToast('La fecha inicio no puede ser mayor al fin', true);

    GoalsStore.update(selectedGoal.id, {
      name, target, current,
      pct: calcPct(current, target),
      start, end,
    });

    showToast(`"${name}" modificada ✓`);
    refresh();
    DeleteModule.refresh();
  }

  function cancel() {
    document.getElementById('edit-select').value = '';
    showEditForm(false);
    selectedGoal = null;
  }

  return { refresh, onSelect, updatePreview, changeAmount, submit, cancel };
})();

// ============================================
// 5. TabsModule — navegación entre los 3 tabs
// ============================================
const TabsModule = (() => {

  const TABS = ['add', 'delete', 'edit'];
  const ACTIVE_CLASS = { add: 'active-add', delete: 'active-delete', edit: 'active-edit' };

  function show(tab) {
    TABS.forEach(t => {
      document.getElementById(`tab-${t}`).classList.remove('active-add','active-delete','active-edit');
      document.getElementById(`panel-${t}`).classList.remove('visible');
    });
    document.getElementById(`tab-${tab}`).classList.add(ACTIVE_CLASS[tab]);
    document.getElementById(`panel-${tab}`).classList.add('visible');
  }

  return { show };
})();

// ============================================
// TEMA
// ============================================
function setTheme(mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark');
  localStorage.setItem('theme', mode);
}
setTheme(localStorage.getItem('theme') || 'light');

// ============================================
// INIT — todos los eventos aquí, ningún onclick en el HTML
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // ── Inicializa módulos ──
  AddModule.init();
  DeleteModule.refresh();
  EditModule.refresh();
  TabsModule.show('add');

  // ── Tema ──
  document.getElementById('btn-theme-light')
    .addEventListener('click', () => setTheme('light'));
  document.getElementById('btn-theme-dark')
    .addEventListener('click', () => setTheme('dark'));

  // ── Tabs ──
  document.getElementById('tab-add')
    .addEventListener('click', () => TabsModule.show('add'));
  document.getElementById('tab-delete')
    .addEventListener('click', () => TabsModule.show('delete'));
  document.getElementById('tab-edit')
    .addEventListener('click', () => TabsModule.show('edit'));

  // ── Panel Agregar ──
  document.getElementById('btn-add-minus')
    .addEventListener('click', () => AddModule.changeAmount(-1000));
  document.getElementById('btn-add-plus')
    .addEventListener('click', () => AddModule.changeAmount(1000));
  document.getElementById('btn-add-submit')
    .addEventListener('click', () => AddModule.submit());

  // ── Panel Eliminar ──
  document.getElementById('btn-delete-cancel')
    .addEventListener('click', () => DeleteModule.cancelDelete());
  document.getElementById('btn-delete-confirm')
    .addEventListener('click', () => DeleteModule.confirmDelete());

  // ── Panel Modificar ──
  document.getElementById('edit-select')
    .addEventListener('change', function () { EditModule.onSelect(this.value); });
  document.getElementById('edit-name')
    .addEventListener('input', () => EditModule.updatePreview());
  document.getElementById('edit-target')
    .addEventListener('input', () => EditModule.updatePreview());
  document.getElementById('edit-current')
    .addEventListener('input', () => EditModule.updatePreview());
  document.getElementById('btn-edit-minus')
    .addEventListener('click', () => EditModule.changeAmount(-1000));
  document.getElementById('btn-edit-plus')
    .addEventListener('click', () => EditModule.changeAmount(1000));
  document.getElementById('btn-edit-cancel')
    .addEventListener('click', () => EditModule.cancel());
  document.getElementById('btn-edit-submit')
    .addEventListener('click', () => EditModule.submit());

});