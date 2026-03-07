from fastapi import FastAPI

app = FastAPI()

usuarios = []

@app.get("/")
def home():
    return {"mensaje": "Mi API está funcionando"}

@app.get("/eventos")
def listar_eventos():
    return {"eventos": ["CONIITI 2024", "Taller React", "Charla IA"]}

@app.post("/registro")
def registrar(correo: str, usuario: str, contraseña: str, edad: int):
    
    nuevo_usuario = {
        "correo": correo,
        "usuario": usuario,
        "contraseña": contraseña,
        "edad": edad
    }

    usuarios.append(nuevo_usuario)

    return {"mensaje": "Usuario registrado correctamente"}

@app.post("/login")
def login(correo: str, contraseña: str):

    for usuario in usuarios:
        if usuario["correo"] == correo and usuario["contraseña"] == contraseña:
            return {"mensaje": f"Bienvenido {usuario['usuario']}"}

    return {"mensaje": "Datos incorrectos"}