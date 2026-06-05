from sqlalchemy.orm import Session

from src.models.saving_goal_entity import SavingGoalEntity
from src.repositories.saving_goal_repository import SavingGoalRepository


class SQLiteSavingGoalRepository(SavingGoalRepository):

    def __init__(self, db: Session):
        self.db = db

    def guardar(self, meta):
        self.db.add(meta)
        self.db.commit()
        self.db.refresh(meta)
        return meta

    def listar_por_usuario(self, usuario_id):
        return (
            self.db
            .query(SavingGoalEntity)
            .filter(
                SavingGoalEntity.usuario_id == usuario_id,
                SavingGoalEntity.activa == True
            )
            .all()
        )

    def ocultar(self, meta_id):
        meta = (
            self.db
            .query(SavingGoalEntity)
            .filter(SavingGoalEntity.id == meta_id)
            .first()
        )

        if meta:
            meta.activa = False
            self.db.commit()