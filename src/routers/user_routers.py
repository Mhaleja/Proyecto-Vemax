from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.models.user_model import RegistroModel, LoginModel
from src.controllers.user_controller import UserController
from src.database.connection import obtener_db
from src.repositories.user_repository import UserRepository
from src.repositories.sqlite_user_repository import SQLiteUserRepository
from src.services.auth_service import AuthService


router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)


def obtener_repositorio(db: Session = Depends(obtener_db)) -> UserRepository:
    return SQLiteUserRepository(db)


def obtener_auth_service(
    repository: UserRepository = Depends(obtener_repositorio)
):
    return AuthService(repository)


def obtener_controlador(
    auth_service: AuthService = Depends(obtener_auth_service)
):
    return UserController(auth_service)


@router.post("/registro")
def registrar(
    datos: RegistroModel,
    controller: UserController = Depends(obtener_controlador)
):
    return controller.registrar_usuario(datos)


@router.post("/login")
def login(
    datos: LoginModel,
    controller: UserController = Depends(obtener_controlador)
):
    return controller.login_usuario(datos)