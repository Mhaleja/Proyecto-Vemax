from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
#librería que  nos permite trabajar con bases de datos sin escribir SQL directamente todo el tiempo
from sqlalchemy import Boolean

from src.database.base import Base


class MovementEntity(Base):
    __tablename__ = "movimientos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    usuario_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    concepto: Mapped[str] = mapped_column(String(100), nullable=False)
    monto: Mapped[float] = mapped_column(Float, nullable=False)
    categoria: Mapped[str] = mapped_column(String(50), nullable=False)
    metodo: Mapped[str] = mapped_column(String(50), nullable=False)
    fecha: Mapped[str] = mapped_column(String(20), nullable=False)
    nota: Mapped[str] = mapped_column(String(255), nullable=True)

    #para el borrador logico, se crea cada registro como True
    activo: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )