import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from src.routers.user_routers import router as user_router
from src.routers.event_routes import router as event_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user_router)
app.include_router(event_router)

def leerHtml(nombreArc):
    base_dir = os.getcwd()
    ruta = os.path.join(base_dir,"static", "templates", nombreArc)
    
    with open(ruta, "r", encoding="utf-8") as f:
        return f.read()

@app.get("/")
def home():
    return HTMLResponse(leerHtml("paginaInicial.html"))

@app.get('/app') 
def app_principal(): 
    return HTMLResponse(leerHtml("index.html"))