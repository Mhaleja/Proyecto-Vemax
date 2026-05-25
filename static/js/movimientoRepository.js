async function obtenerMovimientos() {
  const sesion = Session.obtener();

  if (!sesion.correo) {
    return [];
  }

  const response = await fetch(`/movimientos/?correo=${encodeURIComponent(sesion.correo)}`);
  const data = await response.json();

  return data.movimientos || [];
}

async function agregarMovimiento(movimiento) {
  const sesion = Session.obtener();

  if (!sesion.correo) {
    alert("Debes iniciar sesión");
    return null;
  }

  const response = await fetch("/movimientos/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      correo: sesion.correo,
      tipo: movimiento.tipo,
      concepto: movimiento.concepto,
      monto: movimiento.monto,
      categoria: movimiento.categoria,
      metodo: movimiento.metodo,
      fecha: movimiento.fecha,
      nota: movimiento.nota || ""
    })
  });

  const data = await response.json();

  return data.movimiento || null;
}

function guardarMovimientos() {
  // Ya no se usa localStorage. Los movimientos se guardan en la base de datos.
}

function eliminarMovimiento(id) {
  // Lo conectamos a la base de datos después.
  console.log("Eliminar movimiento pendiente:", id);
}