from fastapi import FastAPI 
app = FastAPI() 
@app.get("/")
def home(): 

    return {"mensaje": "Mi API está funcionando"} 


@app.get("/eventos") 

def listar_eventos(): 

    return {"eventos": ["CONIITI 2024", "Taller React", "Charla IA"]}         



usuarios = []

def registrar():
    print("\n--------------REGISTRO--------------")
    
    correo = input("Correo: ")
    usuario = input("Usuario: ")
    contraseña = input("Contraseña: ")
    edad = int(input("Edad: "))

    nuevo_usuario = {"correo": correo,"usuario": usuario,"contraseña": contraseña,"edad": edad }
    
    usuarios.append(nuevo_usuario)
    print("Usuario registrado correctamente")

def login():
    print("\n--------------LOGIN--------------")
    
    correo = input("Correo: ")
    contraseña = input("Contraseña: ")
    
    for usuario in usuarios:
        if usuario["correo"] == correo and usuario["contraseña"] == contraseña:
            print(f"Bienvenido {usuario['usuario']} ")
            return
    
    print("Datos incorrectos ")
#h
registrar()
login()