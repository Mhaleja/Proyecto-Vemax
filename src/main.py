from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from src.routers.user_routers import router as user_router
from src.routers.event_routers import router as event_router

app = FastAPI()

SRC_DIR = Path(__file__).resolve().parent
ROOT_DIR = SRC_DIR.parent

app.mount(
    "/static",
    StaticFiles(directory=ROOT_DIR / "static"),
    name="static"
)

#app.include_router(user_router)
#app.include_router(event_router)

def leerHtml(nombreArc):
    ruta = ROOT_DIR / "static" / "templates" / nombreArc
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()

@app.get("/")
def inicio():
    return HTMLResponse(leerHtml("paginaInicial.html"))

@app.get("/registro")
def registro():
    return HTMLResponse(leerHtml("index.html"))

@app.get("/dashboard")
def dashboard():
    return HTMLResponse(leerHtml("dashboard.html"))