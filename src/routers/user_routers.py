from fastapi import APIRouter, Depends
from src.models.user_model import RegistroModel, LoginModel
from src.controllers.user_controller import UserController
from src.repositories.user_repository import UserRepository, user_repository_instance
from src.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# DIP:
# Aquí se cumple porque la ruta no crea directamente el repositorio dentro de cada endpoint.
# Esta función se encarga de devolver el repositorio que se va a usar en la aplicación.
def obtener_repositorio():
    return user_repository_instance
# DIP
def obtener_auth_service(repository: UserRepository = Depends(obtener_repositorio)):
    return AuthService(repository)
# DIP
def obtener_controlador(auth_service: AuthService = Depends(obtener_auth_service)):
    return UserController(auth_service)
# SRP
@router.post("/registro")
def registrar(datos: RegistroModel, controller: UserController = Depends(obtener_controlador)):
    return controller.registrar_usuario(datos)
# SRP
@router.post("/login")
def login(datos: LoginModel, controller: UserController = Depends(obtener_controlador)):
    return controller.login_usuario(datos)