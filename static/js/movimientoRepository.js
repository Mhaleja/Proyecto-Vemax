const MOVIMIENTOS_KEY = 'vemax_movimientos';

const movimientosIniciales = [
  { id:1, tipo:'ingreso', concepto:'Beca universitaria', monto:800000, categoria:'Estudios', metodo:'Transferencia', fecha:'2025-05-01', nota:'' },
  { id:2, tipo:'egreso', concepto:'Almuerzo cafetería', monto:8500, categoria:'Alimentación', metodo:'Efectivo', fecha:'2025-05-03', nota:'Menú del día' },
  { id:3, tipo:'egreso', concepto:'Bus ida y vuelta', monto:4200, categoria:'Transporte', metodo:'Efectivo', fecha:'2025-05-04', nota:'' },
  { id:4, tipo:'ingreso', concepto:'Trabajo freelance', monto:350000, categoria:'Trabajo', metodo:'Transferencia', fecha:'2025-05-10', nota:'Proyecto web' },
  { id:5, tipo:'egreso', concepto:'Libros semestre', monto:95000, categoria:'Estudios', metodo:'Tarjeta', fecha:'2025-05-12', nota:'' },
];

function obtenerMovimientos() {
  const guardados = localStorage.getItem(MOVIMIENTOS_KEY);

  if (!guardados) {
    guardarMovimientos(movimientosIniciales);
    return movimientosIniciales;
  }

  return JSON.parse(guardados);
}

function guardarMovimientos(movimientos) {
  localStorage.setItem(MOVIMIENTOS_KEY, JSON.stringify(movimientos));
}

function agregarMovimiento(movimiento) {
  const movimientos = obtenerMovimientos();
  movimientos.unshift(movimiento);
  guardarMovimientos(movimientos);
  return movimiento;
}

function eliminarMovimiento(id) {
  const movimientos = obtenerMovimientos().filter(m => m.id !== id);
  guardarMovimientos(movimientos);
}