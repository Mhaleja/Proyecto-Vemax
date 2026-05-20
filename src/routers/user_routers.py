from fastapi import APIRouter, Depends
from src.models.user_model import RegistroModel, LoginModel
from src.controllers.user_controller import UserController
from src.repositories.user_repository import user_repository_instance

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# DIP:
# Aquí creamos esta función que sirve como una "fábrica".
# Se encarga de armar el UserController pasándole el repositorio que creamos antes.
def obtener_controlador():
    return UserController(user_repository_instance)

@router.post("/registro")
def registrar(datos: RegistroModel, controller = Depends(obtener_controlador)):
    return controller.registrar_usuario(datos)

@router.post("/login")
def login(datos: LoginModel, controller = Depends(obtener_controlador)):
    return controller.login_usuario(datos)