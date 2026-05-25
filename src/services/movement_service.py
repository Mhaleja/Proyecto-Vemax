from src.models.movement_entity import MovementEntity


class MovementService:

    def __init__(self, movement_repository, user_repository):
        self.movement_repository = movement_repository
        self.user_repository = user_repository

    def crear_movimiento(self, datos):
        usuario = self.user_repository.buscar_por_correo(datos.correo)

        if not usuario:
            return {"mensaje": "Usuario no encontrado"}

        nuevo_movimiento = MovementEntity(
            usuario_id=usuario.id,
            tipo=datos.tipo,
            concepto=datos.concepto,
            monto=datos.monto,
            categoria=datos.categoria,
            metodo=datos.metodo,
            fecha=datos.fecha,
            nota=datos.nota
        )

        movimiento = self.movement_repository.guardar(nuevo_movimiento)

        return {
            "mensaje": "Movimiento guardado con exito",
            "movimiento": {
                "id": movimiento.id,
                "tipo": movimiento.tipo,
                "concepto": movimiento.concepto,
                "monto": movimiento.monto,
                "categoria": movimiento.categoria,
                "metodo": movimiento.metodo,
                "fecha": movimiento.fecha,
                "nota": movimiento.nota
            }
        }

    def listar_movimientos(self, correo):
        usuario = self.user_repository.buscar_por_correo(correo)

        if not usuario:
            return {"movimientos": []}

        movimientos = self.movement_repository.listar_por_usuario(usuario.id)

        return {
            "movimientos": [
                {
                    "id": movimiento.id,
                    "tipo": movimiento.tipo,
                    "concepto": movimiento.concepto,
                    "monto": movimiento.monto,
                    "categoria": movimiento.categoria,
                    "metodo": movimiento.metodo,
                    "fecha": movimiento.fecha,
                    "nota": movimiento.nota
                }
                for movimiento in movimientos
            ]
        }