from src.models.user_model import RegistroModel, LoginModel

class UserController:
    # DIP: Aquí el controlador no crea el servicio ni depende de una clase concreta.
    # Solo recibe el servicio ya creado y trabaja con él.
    def __init__(self, auth_service):
        self.auth_service = auth_service

    def registrar_usuario(self, datos: RegistroModel):
        # SRP: Aquí el controlador no guarda datos ni valida,
        # solo manda la tarea de registrar al servicio de autenticación.
       return self.auth_service.registrar_usuario(datos)

    def login_usuario(self, datos: LoginModel):
        # SRP: Aquí el controlador no valida las credenciales directamente,
        # solo manda la tarea de iniciar sesión al servicio de autenticación.
        return self.auth_service.login_usuario(datos)
