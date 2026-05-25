from sqlalchemy.orm import Session

from src.models.user_entity import UserEntity
from src.repositories.user_repository import UserRepository


class SQLiteUserRepository(UserRepository):

    def __init__(self, db: Session):
        self.db = db

    def guardar(self, usuario):
        self.db.add(usuario)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def buscar_por_correo(self, correo):
        return (
            self.db
            .query(UserEntity)
            .filter(UserEntity.correo == correo)
            .first()
        )