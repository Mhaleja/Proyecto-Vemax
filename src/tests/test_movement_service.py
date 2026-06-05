from types import SimpleNamespace

from src.models.movement_model import CrearMovimientoModel
from src.services.movement_service import MovementService


class FakeUserRepository:
    def __init__(self, usuario=None):
        self.usuario = usuario

    def buscar_por_correo(self, correo):
        if self.usuario and self.usuario.correo == correo:
            return self.usuario
        return None


class FakeMovementRepository:
    def __init__(self, movimientos=None):
        self.movimientos = movimientos or []
        self.movimiento_guardado = None
        self.movimiento_ocultado_id = None

    def guardar(self, movimiento):
        movimiento.id = 1
        self.movimiento_guardado = movimiento
        return movimiento

    def listar_por_usuario(self, usuario_id):
        return [
            movimiento
            for movimiento in self.movimientos
            if movimiento.usuario_id == usuario_id
        ]

    def ocultar(self, movimiento_id):
        self.movimiento_ocultado_id = movimiento_id


def test_crear_movimiento_guarda_movimiento_cuando_usuario_existe():
    usuario = SimpleNamespace(id=10, correo="ana@test.com")
    user_repository = FakeUserRepository(usuario)
    movement_repository = FakeMovementRepository()
    service = MovementService(movement_repository, user_repository)
    datos = CrearMovimientoModel(
        correo="ana@test.com",
        tipo="gasto",
        concepto="Almuerzo",
        monto=25000,
        categoria="Comida",
        metodo="Efectivo",
        fecha="2026-06-05",
        nota="Menu del dia",
    )

    respuesta = service.crear_movimiento(datos)

    assert respuesta["mensaje"] == "Movimiento guardado con exito"
    assert respuesta["movimiento"]["id"] == 1
    assert respuesta["movimiento"]["concepto"] == "Almuerzo"
    assert respuesta["movimiento"]["monto"] == 25000
    assert movement_repository.movimiento_guardado.usuario_id == usuario.id


def test_crear_movimiento_retorna_mensaje_cuando_usuario_no_existe():
    user_repository = FakeUserRepository()
    movement_repository = FakeMovementRepository()
    service = MovementService(movement_repository, user_repository)
    datos = CrearMovimientoModel(
        correo="nadie@test.com",
        tipo="ingreso",
        concepto="Salario",
        monto=1000000,
        categoria="Trabajo",
        metodo="Transferencia",
        fecha="2026-06-05",
    )

    respuesta = service.crear_movimiento(datos)

    assert respuesta == {"mensaje": "Usuario no encontrado"}
    assert movement_repository.movimiento_guardado is None


def test_listar_movimientos_retorna_lista_del_usuario():
    usuario = SimpleNamespace(id=10, correo="ana@test.com")
    movimientos = [
        SimpleNamespace(
            id=1,
            usuario_id=10,
            tipo="gasto",
            concepto="Almuerzo",
            monto=25000,
            categoria="Comida",
            metodo="Efectivo",
            fecha="2026-06-05",
            nota=None,
        ),
        SimpleNamespace(
            id=2,
            usuario_id=99,
            tipo="ingreso",
            concepto="Otro usuario",
            monto=50000,
            categoria="Otros",
            metodo="Efectivo",
            fecha="2026-06-05",
            nota=None,
        ),
    ]
    user_repository = FakeUserRepository(usuario)
    movement_repository = FakeMovementRepository(movimientos)
    service = MovementService(movement_repository, user_repository)

    respuesta = service.listar_movimientos("ana@test.com")

    assert respuesta == {
        "movimientos": [
            {
                "id": 1,
                "tipo": "gasto",
                "concepto": "Almuerzo",
                "monto": 25000,
                "categoria": "Comida",
                "metodo": "Efectivo",
                "fecha": "2026-06-05",
                "nota": None,
            }
        ]
    }


def test_listar_movimientos_retorna_lista_vacia_si_usuario_no_existe():
    service = MovementService(FakeMovementRepository(), FakeUserRepository())

    respuesta = service.listar_movimientos("nadie@test.com")

    assert respuesta == {"movimientos": []}


def test_ocultar_movimiento_llama_al_repositorio():
    movement_repository = FakeMovementRepository()
    service = MovementService(movement_repository, FakeUserRepository())

    respuesta = service.ocultar_movimiento(3)

    assert respuesta == {"mensaje": "Movimiento ocultado"}
    assert movement_repository.movimiento_ocultado_id == 3