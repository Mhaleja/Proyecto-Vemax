from fastapi import APIRouter

router = APIRouter(
    prefix="/eventos",
    tags=["Eventos"]
)

# NOTA POR SI LAS MOSCAS:
# Muchachas por ahora este endpoint solo devuelve un "holi" de prueba. 
# Como no maneja lógica ni datos reales, no rompe ningún principio SOLID.
# Cuando vayamos a meterle lógica real a los eventos, recuerden que para mantener SRP y DIP,
# no debemos meter la base de datos aquí. Tendremos que crearle su propio EventController 
# y ps inyectarlo con Depends(), como con los usuarios.
@router.get("/")
def listar_eventos():
    return {"eventos": [" holi"]}