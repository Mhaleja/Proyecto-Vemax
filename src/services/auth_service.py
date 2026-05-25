from passlib.context import CryptContext
from src.models.user_entity import UserEntity


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:

    # DIP:
    # El servicio no crea el repositorio directamente.
    # Lo recibe desde afuera y trabaja contra esa abstracción.
    def __init__(self, repository):
        self.repository = repository

    # SRP:
    # Este método solo se encarga del registro:
    # valida si el correo existe, cifra la contraseña y manda a guardar.
    def registrar_usuario(self, datos):
        usuario_existente = self.repository.buscar_por_correo(datos.correo)

        if usuario_existente:
            return {"mensaje": "El correo ya esta registrado"}

        password_hash = pwd_context.hash(datos.password)

        nuevo_usuario = UserEntity(
            usuario=datos.usuario,
            correo=datos.correo,
            password_hash=password_hash
        )

        self.repository.guardar(nuevo_usuario)

        return {
            "mensaje": "Usuario registrado con exito",
            "usuario": datos.usuario,
            "correo": datos.correo
        }

    # SRP:
    # Este método solo se encarga del login:
    # busca el usuario y verifica la contraseña cifrada.
    def login_usuario(self, datos):
        usuario = self.repository.buscar_por_correo(datos.correo)

        if not usuario:
            return {"mensaje": "Datos incorrectos"}

        password_valida = pwd_context.verify(
            datos.password,
            usuario.password_hash
        )

        if not password_valida:
            return {"mensaje": "Datos incorrectos"}

        return {
            "mensaje": "Bienvenido",
            "usuario": usuario.usuario,
            "correo": usuario.correo
        }