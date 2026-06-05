from abc import ABC, abstractmethod

class SavingGoalRepository(ABC):

    @abstractmethod
    def guardar(self, meta):
        pass

    @abstractmethod
    def listar_por_usuario(self, usuario_id):
        pass

    @abstractmethod
    def ocultar(self, meta_id):
        pass