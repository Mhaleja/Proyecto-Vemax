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
