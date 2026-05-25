from sqlalchemy.orm import Session

from src.models.movement_entity import MovementEntity
from src.repositories.movement_repository import MovementRepository


class SQLiteMovementRepository(MovementRepository):

    def __init__(self, db: Session):
        self.db = db

    def guardar(self, movimiento):
        self.db.add(movimiento)
        self.db.commit()
        self.db.refresh(movimiento)
        return movimiento

    def listar_por_usuario(self, usuario_id):
        return (
            self.db
            .query(MovementEntity)
            .filter(MovementEntity.usuario_id == usuario_id)
            .all()
        )