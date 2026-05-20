from pydantic import BaseModel

# SRP: Estos modelos solo se encargan de definir y validar
# la estructura de los datos que llegan del cliente.

class RegistroModel(BaseModel):
    correo: str
    usuario: str
    password: str
    edad: int

class LoginModel(BaseModel):
    correo: str
    password: str