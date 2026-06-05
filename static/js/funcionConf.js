/* ============================================
   funcionConf.js
   Módulos independientes (SOLID):
     1. UserStore       — datos del usuario
     2. PasswordModule  — cambiar contraseña
     3. NameModule      — cambiar nombre
     4. DeleteModule    — eliminar cuenta
     5. AccordionModule — abre/cierra secciones
     6. ThemeModule     — modo claro/oscuro
   ============================================ */


// 1. UserStore — fuente única de verdad

const UserStore = (() => {

  const DEFAULT = {
    name:  'Adaline Lively',
    email: 'adalineal@gmail.com',
  };

  function load() {
    try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem('finset_user') || '{}') }; }
    catch { return DEFAULT; }
  }

  function save(changes) {
    localStorage.setItem('finset_user', JSON.stringify({ ...load(), ...changes }));
  }

  function get()         { return load(); }
  function setName(name) { save({ name }); }

  return { get, setName };
})();

// ============================================
// UTILIDADES
// ============================================
function showToast(msg, isError = false) {
  const t = document.getElementById('toast');
  t.textContent      = msg;
  t.style.background = isError ? '#EF4444' : 'var(--primary)';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================
// 2. PasswordModule — cambiar contraseña
// ============================================
const PasswordModule = (() => {

  function init() {
    document.getElementById('pw-new')
      .addEventListener('input', onNewPasswordInput);
  }

  // Calcula fortaleza 0-4
  function getStrength(pw) {
    let score = 0;
    if (pw.length >= 8)              score++;
    if (/[A-Z]/.test(pw))            score++;
    if (/[0-9]/.test(pw))            score++;
    if (/[^A-Za-z0-9]/.test(pw))     score++;
    return score;
  }

  function onNewPasswordInput(e) {
    const pw    = e.target.value;
    const score = getStrength(pw);
    const fill  = document.getElementById('pw-strength-fill');
    const label = document.getElementById('pw-strength-label');

    const levels = [
      { w:'0%',   bg:'transparent', text:'' },
      { w:'25%',  bg:'#EF4444',     text:'Muy débil' },
      { w:'50%',  bg:'#F97316',     text:'Débil' },
      { w:'75%',  bg:'#EAB308',     text:'Media' },
      { w:'100%', bg:'#22C55E',     text:'Fuerte ' },
    ];

    fill.style.width      = levels[score].w;
    fill.style.background = levels[score].bg;
    label.textContent     = levels[score].text;
    label.style.color     = levels[score].bg;
  }

  function toggleVisibility(inputId, btnId) {
    const input = document.getElementById(inputId);
    const btn   = document.getElementById(btnId);
    const isHidden = input.type === 'password';
    input.type    = isHidden ? 'text' : 'password';
    btn.querySelector('.material-symbols-rounded').textContent =
      isHidden ? 'visibility_off' : 'visibility';
  }

  function submit() {
    const current = document.getElementById('pw-current').value;
    const newPw   = document.getElementById('pw-new').value;
    const confirm = document.getElementById('pw-confirm').value;

    if (!current)           return showToast('Escribe tu contraseña actual', true);
    if (newPw.length < 8)   return showToast('La nueva contraseña debe tener al menos 8 caracteres', true);
    if (newPw !== confirm)  return showToast('Las contraseñas no coinciden', true);
    if (getStrength(newPw) < 2) return showToast('La contraseña es muy débil', true);

    /*
    ── Conectar con FastAPI ──
    fetch('http://localhost:8000/api/user/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: current, new_password: newPw }),
    }).then(...).catch(...);
    */

    // Limpia campos
    ['pw-current','pw-new','pw-confirm'].forEach(id => {
      document.getElementById(id).value = '';
    });
    document.getElementById('pw-strength-fill').style.width = '0%';
    document.getElementById('pw-strength-label').textContent = '';

    showToast('Contraseña actualizada ');
    AccordionModule.close('password');
  }

  return { init, toggleVisibility, submit };
})();

// ============================================
// 4. NameModule — cambiar nombre de usuario
// ============================================
const NameModule = (() => {

  function init() {
    const user = UserStore.get();
    document.getElementById('name-input').value       = user.name;
    document.getElementById('name-email-input').value = user.email;
  }

  function submit() {
    const name  = document.getElementById('name-input').value.trim();
    const email = document.getElementById('name-email-input').value.trim();

    if (!name)                      return showToast('El nombre no puede estar vacío', true);
    if (!email.includes('@'))       return showToast('El email no es válido', true);

    /*
    ── Conectar con FastAPI ──
    fetch('http://localhost:8000/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    }).then(...).catch(...);
    */

    UserStore.setName(name);
    showToast('Perfil actualizado');
    AccordionModule.close('name');
  }

  return { init, submit };
})();

// 5. DeleteModule — eliminar cuenta

const DeleteModule = (() => {

  function showConfirm() {
    document.getElementById('delete-confirm').classList.add('visible');
    document.getElementById('delete-confirm-input').focus();
  }

  function hideConfirm() {
    document.getElementById('delete-confirm').classList.remove('visible');
    document.getElementById('delete-confirm-input').value = '';
  }

  function submit() {
    const val = document.getElementById('delete-confirm-input').value.trim();

    if (val !== 'ELIMINAR') {
      showToast('Escribe ELIMINAR para confirmar', true); return;
    }

    /*
    ── Conectar con FastAPI ──
    fetch('http://localhost:8000/api/user', { method: 'DELETE' })
      .then(() => { localStorage.clear(); window.location.href = '/login'; })
      .catch(() => showToast('Error al eliminar la cuenta', true));
    */

    // Simulación: limpia datos y redirige
    localStorage.clear();
    showToast('Recogiste tus bellotas y dejaste la madriguera. Tu perfil se ha borrado con éxito. ¡Hasta pronto!');
    setTimeout(() => window.location.href = '../index.html', 2000);
  }

  return { showConfirm, hideConfirm, submit };
})();

// ============================================
// 6. AccordionModule — abre y cierra secciones
// ============================================
const AccordionModule = (() => {

  // Solo las secciones que quedan
  const sections = ['password', 'name', 'delete'];

  function toggle(id) {
    const panel   = document.getElementById(`panel-${id}`);
    const chevron = document.getElementById(`chevron-${id}`);
    const isOpen  = panel.classList.contains('open');

    // Cierra todos
    sections.forEach(s => {
      document.getElementById(`panel-${s}`)?.classList.remove('open');
      document.getElementById(`chevron-${s}`)?.classList.remove('open');
    });

    // Si no estaba abierto, ábrelo
    if (!isOpen) {
      panel.classList.add('open');
      chevron.classList.add('open');
    }
  }

  function close(id) {
    document.getElementById(`panel-${id}`)?.classList.remove('open');
    document.getElementById(`chevron-${id}`)?.classList.remove('open');
  }

  return { toggle, close };
})();

// ============================================
// Tema oscuro y claro
// ============================================
const ThemeModule = (() => {
  function set(mode) {
    document.documentElement.classList.toggle('dark', mode === 'dark');
    localStorage.setItem('theme', mode);
  }
  return { set };
})();

ThemeModule.set(localStorage.getItem('theme') || 'light');

// ============================================
// INIT — todos los eventos aquí, ningún onclick en el HTML
// ============================================
document.addEventListener('DOMContentLoaded', () => {

  // ── Inicializa módulos ──
  PasswordModule.init();
  NameModule.init();

  // ── Tema ──
  document.getElementById('btn-theme-light')
    .addEventListener('click', () => ThemeModule.set('light'));
  document.getElementById('btn-theme-dark')
    .addEventListener('click', () => ThemeModule.set('dark'));

  // ── Acordeones ──
  document.getElementById('header-password')
    .addEventListener('click', () => AccordionModule.toggle('password'));
  document.getElementById('header-name')
    .addEventListener('click', () => AccordionModule.toggle('name'));
  document.getElementById('header-delete')
    .addEventListener('click', () => AccordionModule.toggle('delete'));

  // ── Contraseña ──
  document.getElementById('btn-pw-current')
    .addEventListener('click', () => PasswordModule.toggleVisibility('pw-current', 'btn-pw-current'));
  document.getElementById('btn-pw-new')
    .addEventListener('click', () => PasswordModule.toggleVisibility('pw-new', 'btn-pw-new'));
  document.getElementById('btn-pw-confirm')
    .addEventListener('click', () => PasswordModule.toggleVisibility('pw-confirm', 'btn-pw-confirm'));
  document.getElementById('btn-pw-cancel')
    .addEventListener('click', () => AccordionModule.close('password'));
  document.getElementById('btn-pw-submit')
    .addEventListener('click', () => PasswordModule.submit());

  // ── Nombre ──
  document.getElementById('btn-name-cancel')
    .addEventListener('click', () => AccordionModule.close('name'));
  document.getElementById('btn-name-submit')
    .addEventListener('click', () => NameModule.submit());

  // ── Eliminar cuenta ──
  document.getElementById('btn-delete-show')
    .addEventListener('click', () => DeleteModule.showConfirm());
  document.getElementById('btn-delete-cancel')
    .addEventListener('click', () => DeleteModule.hideConfirm());
  document.getElementById('btn-delete-confirm')
    .addEventListener('click', () => DeleteModule.submit());

});