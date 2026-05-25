from pydantic import BaseModel


class CrearMovimientoModel(BaseModel):
    correo: str
    tipo: str
    concepto: str
    monto: float
    categoria: str
    metodo: str
    fecha: str
    nota: str  | None = None


class ListarMovimientosModel(BaseModel):
    correo: str