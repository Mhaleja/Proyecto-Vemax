from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()
app.mount("/static", StaticFiles(directory="."), name="static")

usuarios = []

class RegistroModel(BaseModel):
    correo: str
    usuario: str
    contrasena: str
    codigo: int

class LoginModel(BaseModel):
    correo: str
    contrasena: str


@app.get("/")
def home():
    return FileResponse("index.html")

@app.get("/dashboard")
def dashboard():
    return FileResponse("pagina_des.html")

@app.get("/perfil")
def perfil():
    return FileResponse("perfil.html")


@app.post("/registro")
def registrar(datos: RegistroModel):
    nuevo = datos.dict()
    nuevo["id"] = len(usuarios) + 1
    usuarios.append(nuevo)
    return {"mensaje": f"Usuario {datos.usuario} registrado correctamente"}


@app.post("/login")
def login(datos: LoginModel):
    for usuario in usuarios:
        if usuario["correo"] == datos.correo:
            if usuario["contrasena"] == datos.contrasena:
                return {"mensaje": f"Bienvenido {usuario['usuario']}"}
            return {"mensaje": "Contraseña incorrecta"}

    return {"mensaje": "El usuario no existe"}