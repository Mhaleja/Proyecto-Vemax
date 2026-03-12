from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

usuarios = []

class RegistroModel(BaseModel):
    correo: str
    usuario: str
    password: str
    edad: int

class LoginModel(BaseModel):
    correo: str
    password: str


# Servir archivos estáticos
app.mount("/", StaticFiles(directory=".", html=True), name="static")


@app.post("/registro")
def registrar(datos: RegistroModel):
    usuarios.append(datos.dict())
    return {"mensaje": "Usuario registrado"}


@app.post("/login")
def login(datos: LoginModel):
    for usuario in usuarios:
        if usuario["correo"] == datos.correo and usuario["password"] == datos.password:
            return {"mensaje": f"Bienvenido {usuario['usuario']}"}
    return {"mensaje": "Datos incorrectos"}