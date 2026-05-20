from abc import ABC, abstractmethod


# DIP y OCP:
# Muchachas aquí na mas cree una clase abstracta que funciona como una guía,
# Aquí solo definimos qué métodos debe tener cualquier repositorio de usuarios, sin importar cómo guarde los datos.
# También se cumple OCP porque si después queremos usar una base de datos real,
# podemos crear otra clase que herede de UserRepository sin modificar las demás capas.
class UserRepository(ABC):
    @abstractmethod
    def guardar(self, usuario):
        pass

    @abstractmethod
    def buscar_por_correo(self, correo):
        pass

# SRP:
# Aquí se cumple porque esta clase tiene una sola responsabilidad:
# guardar y buscar usuarios en memoria,
# no valida login, no maneja rutas y no controla respuestas HTTP.
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

