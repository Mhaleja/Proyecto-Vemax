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
            #.filter(MovementEntity.usuario_id == usuario_id)

            #toma solo los movimientos activos para poder mostrar al us
            .filter(
                MovementEntity.usuario_id == usuario_id,
                MovementEntity.activo == True
            )
            .all()
        )
    
  #acá añadimos un metodo que funcione como borrador logico para marcar como False el regitro 
  #y ocultarlo al us pero que siga en la base de datos
   
    def ocultar(self, movimiento_id):
        movimiento = (
            self.db
            .query(MovementEntity)
            .filter(MovementEntity.id == movimiento_id)
            .first()
        )

        if movimiento:
            movimiento.activo = False
            self.db.commit()