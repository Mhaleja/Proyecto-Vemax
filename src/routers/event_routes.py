from fastapi import APIRouter

router = APIRouter(
    prefix="/eventos",
    tags=["Eventos"]
)

@router.get("/")
def listar_eventos():
    return {"eventos": [" holi"]}