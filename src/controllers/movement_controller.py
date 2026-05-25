class MovementController:

    def __init__(self, movement_service):
        self.movement_service = movement_service

    def crear_movimiento(self, datos):
        return self.movement_service.crear_movimiento(datos)

    def listar_movimientos(self, correo):
        return self.movement_service.listar_movimientos(correo)