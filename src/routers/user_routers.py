from fastapi import APIRouter
from src.models.user_model import RegistroModel, LoginModel
from src.controllers.user_controller import UserController

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

@router.post("/registro")
def registrar(datos: RegistroModel):
    return UserController.registrar_usuario(datos)

@router.post("/login")
def login(datos: LoginModel):
    return UserController.login_usuario(datos)