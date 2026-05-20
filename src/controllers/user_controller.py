from src.models.user_model import RegistroModel, LoginModel

class UserController:
    # DIP: Aquí el controlador ya no crea la conexión ni depende de una base de datos específica.
    # Solo recibe el repositorio y trabaja con él.
    def __init__(self, repository):
        self.repository = repository

    def registrar_usuario(self, datos: RegistroModel):
        # SRP: El controlador no guarda datos directamente,
        # simplemente manda esa tarea al repositorio.
        self.repository.guardar(datos)
        return {"mensaje": "Usuario registrado con éxito"}

    def login_usuario(self, datos: LoginModel):
        # Le pedimos al repositorio el usuario según el correo
        usuario = self.repository.buscar_por_correo(datos.correo)
        
        # Acá queda únicamente la validación del login
        if usuario and usuario["password"] == datos.password:
            return {"mensaje": f"Bienvenido {usuario['usuario']}"}
            
        return {"mensaje": "Datos incorrectos"}