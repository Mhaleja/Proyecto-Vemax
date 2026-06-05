from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.database.base import Base


class SavingGoalEntity(Base):
    __tablename__ = "metas_ahorro"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)

    usuario_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    monto_objetivo: Mapped[float] = mapped_column(Float, nullable=False)
    monto_actual: Mapped[float] = mapped_column(Float, default=0)
    activa: Mapped[bool] = mapped_column(Boolean, default=True)