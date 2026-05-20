from pydantic import BaseModel

class RegistroModel(BaseModel):
    correo: str
    usuario: str
    password: str
    edad: int

class LoginModel(BaseModel):
    correo: str
    password: str