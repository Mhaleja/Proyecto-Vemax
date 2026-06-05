from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.controllers.saving_goal_controller import SavingGoalController
from src.database.connection import obtener_db
from src.models.saving_goal_model import CrearMetaAhorroModel
from src.repositories.sqlite_saving_goal_repository import SQLiteSavingGoalRepository
from src.repositories.sqlite_user_repository import SQLiteUserRepository
from src.services.saving_goal_service import SavingGoalService


router = APIRouter(
    prefix="/metas-ahorro",
    tags=["Metas de ahorro"]
)


def obtener_controlador(db: Session = Depends(obtener_db)):
    user_repository = SQLiteUserRepository(db)
    saving_goal_repository = SQLiteSavingGoalRepository(db)
    saving_goal_service = SavingGoalService(saving_goal_repository, user_repository)

    return SavingGoalController(saving_goal_service)


@router.post("/")
def crear_meta(
    datos: CrearMetaAhorroModel,
    controller: SavingGoalController = Depends(obtener_controlador)
):
    return controller.crear_meta(datos)


@router.get("/")
def listar_metas(
    correo: str,
    controller: SavingGoalController = Depends(obtener_controlador)
):
    return controller.listar_metas(correo)


@router.put("/ocultar/{meta_id}")
def ocultar_meta(
    meta_id: int,
    controller: SavingGoalController = Depends(obtener_controlador)
):
    return controller.ocultar_meta(meta_id)