from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.controllers.movement_controller import MovementController
from src.database.connection import obtener_db
from src.models.movement_model import CrearMovimientoModel
from src.repositories.sqlite_movement_repository import SQLiteMovementRepository
from src.repositories.sqlite_user_repository import SQLiteUserRepository
from src.services.movement_service import MovementService


router = APIRouter(
    prefix="/movimientos",
    tags=["Movimientos"]
)


def obtener_controlador(db: Session = Depends(obtener_db)):
    user_repository = SQLiteUserRepository(db)
    movement_repository = SQLiteMovementRepository(db)
    movement_service = MovementService(movement_repository, user_repository)

    return MovementController(movement_service)


@router.post("/")
def crear_movimiento(
    datos: CrearMovimientoModel,
    controller: MovementController = Depends(obtener_controlador)
):
    return controller.crear_movimiento(datos)


@router.get("/")
def listar_movimientos(
    correo: str,
    controller: MovementController = Depends(obtener_controlador)
):
    return controller.listar_movimientos(correo)