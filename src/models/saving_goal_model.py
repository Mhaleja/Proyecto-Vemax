from pydantic import BaseModel

class CrearMetaAhorroModel(BaseModel):
    correo: str
    nombre: str
    monto_objetivo: float
    monto_actual: float = 0


class ListarMetasAhorroModel(BaseModel):
    correo: str