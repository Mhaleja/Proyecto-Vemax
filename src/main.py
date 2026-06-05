from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from src.database.connection import crear_tablas
from src.routers.user_routers import router as user_router
from src.routers.event_routers import router as event_router
from src.routers.view_routers import router as view_router
from src.routers.movement_routers import router as movement_router
from src.routers.saving_goal_routers import router as saving_goal_router
from src.routers import configuracion_routers

app = FastAPI()

crear_tablas()

app.include_router(configuracion_routers.router)
app.include_router(view_router)
app.include_router(user_router)
app.include_router(event_router)
app.include_router(movement_router)
app.include_router(saving_goal_router)

SRC_DIR = Path(__file__).resolve().parent
ROOT_DIR = SRC_DIR.parent

app.mount(
    "/static",
    StaticFiles(directory=ROOT_DIR / "static"),
    name="static"

)