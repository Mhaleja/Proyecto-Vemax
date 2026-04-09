from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="."), name="static")

usuarios = []

from pydantic import BaseModel

class RegistroModel(BaseModel):
    correo: str
    usuario: str
    contrasena: str
    codigo: int

class LoginModel(BaseModel):
    correo: str
    contrasena: str


@app.get("/", response_class=HTMLResponse)
def home():
    with open("templates/index.html", encoding="utf-8") as f:
        return f.read()

@app.get("/dashboard", response_class=HTMLResponse)
def dashboard():
    with open("templates/pagina_des.html", encoding="utf-8") as f:
        return f.read()

@app.get("/perfil", response_class=HTMLResponse)
def perfil():
    with open("templates/perfil.html", encoding="utf-8") as f:
        return f.read()



@app.post("/registro")
def registrar(datos: RegistroModel):
    nuevo = datos.dict()
    nuevo["id"] = len(usuarios) + 1
    usuarios.append(nuevo)
    return {"mensaje": f"Usuario {datos.usuario} registrado"}


@app.post("/login")
def login(datos: LoginModel):
    for u in usuarios:
        if u["correo"] == datos.correo:
            if u["contrasena"] == datos.contrasena:
                return {"mensaje": f"Bienvenido {u['usuario']}"}
            return {"mensaje": "Contraseña incorrecta"}
    return {"mensaje": "Usuario no existe"}