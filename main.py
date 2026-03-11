from fastapi import FastAPI
from fastapi.responses import FileResponse
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

@app.get("/")
def home():
    return FileResponse("index.html")

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