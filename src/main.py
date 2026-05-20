import os
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from src.routers.user_routers import router as user_router
from src.routers.event_routes import router as event_router

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user_router)
app.include_router(event_router)

@app.get("/")
def home():
    ruta_index = os.path.join("static", "templates", "index.html")
    return FileResponse(ruta_index)