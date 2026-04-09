from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

app = FastAPI()

app.mount("/static", StaticFiles(directory=".", html=True), name="static")
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
    asignarid = len(usuarios) + 1
    nuevoUsuario = datos.dict()
    nuevoUsuario["id"] = asignarid
    usuarios.append(nuevoUsuario)

    return {"mensaje": f"Usuario {datos.usuario} registrado correctamente"}


@app.post("/login")
def login(datos: LoginModel):
    for usuario in usuarios:
        if usuario["correo"] == datos.correo:
            if usuario["contrasena"] == datos.contrasena:
                return {"mensaje": f"Bienvenido {usuario['usuario']}"}
            else:
                return {"mensaje": "Contraseña incorrecta"}

    return {"mensaje": "El usuario no existe"}