function calcularResumenFinanciero(movimientos) {
  const income = movimientos
    .filter(m => m.tipo === 'ingreso')
    .reduce((total, m) => total + Number(m.monto), 0);

  const expense = movimientos
    .filter(m => m.tipo === 'egreso')
    .reduce((total, m) => total + Number(m.monto), 0);

  const balance = income - expense;

  return {
    balance,
    income,
    expense,
    savings: balance > 0 ? balance : 0,
    balance_change: 0,
    income_change: 0,
    expense_change: 0,
    savings_change: 0,
  };
}

function calcularFlujoSemanal(movimientos) {
  const labels = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  const income = [0, 0, 0, 0, 0, 0, 0];
  const expense = [0, 0, 0, 0, 0, 0, 0];

  movimientos.forEach(m => {
    const fecha = new Date(`${m.fecha}T00:00:00`);
    const dia = fecha.getDay();
    const index = dia === 0 ? 6 : dia - 1;

    if (m.tipo === 'ingreso') {
      income[index] += Number(m.monto);
    } else {
      expense[index] += Number(m.monto);
    }
  });

  return { labels, income, expense };
}

function calcularPresupuestoPorCategoria(movimientos) {
  const colores = {
    Alimentación: '#a8d8f5',
    Transporte: '#89c7f0',
    Estudios: '#62afe6',
    Trabajo: '#3d8fc7',
    Entretenimiento: '#7cc4ee',
    Salud: '#bde3f8',
    Familia: '#5aa9df',
    Otros: '#383939',
  };

  const egresos = movimientos.filter(m => m.tipo === 'egreso');
  const total = egresos.reduce((sum, m) => sum + Number(m.monto), 0);

  const acumulado = {};

  egresos.forEach(m => {
    const categoria = m.categoria || 'Otros';
    acumulado[categoria] = (acumulado[categoria] || 0) + Number(m.monto);
  });

  const categories = Object.entries(acumulado).map(([name, amount]) => ({
    name,
    amount,
    color: colores[name] || colores.Otros,
    pct: total > 0 ? Math.round((amount / total) * 100) : 0,
  }));

  return { total, categories };
}