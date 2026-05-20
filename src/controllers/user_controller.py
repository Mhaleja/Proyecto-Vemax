from src.models.user_model import RegistroModel, LoginModel

# Simulación de Base de Datos en memoria
usuarios_db = []

class UserController:
    @staticmethod
    def registrar_usuario(datos: RegistroModel):
        usuarios_db.append(datos.dict())
        return {"mensaje": "Usuario registrado con éxito"}

    @staticmethod
    def login_usuario(datos: LoginModel):
        for usuario in usuarios_db:
            if usuario["correo"] == datos.correo and usuario["password"] == datos.password:
                return {"mensaje": f"Bienvenido {usuario['usuario']}"}
        return {"mensaje": "Datos incorrectos"}