from abc import ABC, abstractmethod


# DIP y OCP:
# Muchachas aquí na mas cree una clase abstracta que funciona como una guía,
# Aquí solo definimos qué métodos debe tener cualquier repositorio de usuarios, sin importar cómo guarde los datos.
class UserRepository(ABC):
    @abstractmethod
    def guardar(self, usuario):
        pass

    @abstractmethod
    def buscar_por_correo(self, correo):
        pass

# SRP:
# Y esta clase se encarga únicamente de manejar
# los usuarios en memoria, ya si después queremos usar una base de datos real,
# podríamos crear otra clase que herede de UserRepository sin tener que cambiar el controlador.
class MemoryUserRepository(UserRepository):
    def __init__(self):
        # La base de datos ahora esta encapsulada aquí, no global
        self._usuarios_db = []

    def guardar(self, usuario):
        self._usuarios_db.append(usuario.dict())

    def buscar_por_correo(self, correo):
        for usuario in self._usuarios_db:
            if usuario["correo"] == correo:
                return usuario
        return None

# Instancia única para simular nuestra base de datos persistente en memoria
user_repository_instance = MemoryUserRepository()