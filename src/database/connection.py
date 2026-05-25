from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.database.base import Base
from src.models.user_entity import UserEntity
from src.models.movement_entity import MovementEntity

DATABASE_URL = "sqlite:///./vemax.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def crear_tablas():
    Base.metadata.create_all(bind=engine)


def obtener_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()