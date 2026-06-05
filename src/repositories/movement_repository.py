from abc import ABC, abstractmethod


class MovementRepository(ABC):

    @abstractmethod
    def guardar(self, movimiento):
        pass

    @abstractmethod
    def listar_por_usuario(self, usuario_id):
        pass
        
    #definimos el metodo pero sin implementar 
    @abstractmethod
    def ocultar(self, movimiento_id):
        pass