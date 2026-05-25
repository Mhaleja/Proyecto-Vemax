from abc import ABC, abstractmethod


class MovementRepository(ABC):

    @abstractmethod
    def guardar(self, movimiento):
        pass

    @abstractmethod
    def listar_por_usuario(self, usuario_id):
        pass