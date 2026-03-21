from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI()

usuarios = []

class RegistroModel(BaseModel):
    correo: str
    usuario: str
    contraseña: str
    codigo: int

class LoginModel(BaseModel):
    correo: str
    contraseña: str


@app.get("/")
def home():
    return FileResponse("index.html")


@app.get("/usuarios")
def obtener_usuarios():
    return usuarios 


@app.post("/registro") 
def registrar(datos: RegistroModel):
    asignarid = len(usuarios) + 1

    nuevoUsuario = datos.dict()
    nuevoUsuario["id"] = asignarid

    usuarios.append(nuevoUsuario)

    return {"mensaje": f"Usuario {datos.usuario} registrado"}


@app.post("/login")
def login(datos: LoginModel):
    for usuario in usuarios:
        if usuario["correo"] == datos.correo:
            if usuario["contraseña"] == datos.contraseña:
                return {"mensaje": f"Bienvenido {usuario['usuario']}"}
            else:
                return {"mensaje": "Contraseña incorrecta"}

    return {"mensaje": "Usuario no existe"}


@app.get("/usuarios/{id}")
def UsuarioId(id: int):
    for usuario in usuarios:
        if usuario["id"] == id:
            return usuario
    
    raise HTTPException(status_code=404, detail="Datos no encontrados, error 404 :)")


@app.get("/buscar")
def buscarUsuario(codigo: int = None):
    if codigo is None:
        return usuarios

    filtrados = [usuario for usuario in usuarios if usuario["codigo"] == codigo]
    return filtrados