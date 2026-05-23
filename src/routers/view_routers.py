from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()

SRC_DIR = Path(__file__).resolve().parents[1]
ROOT_DIR = SRC_DIR.parent

templates = Jinja2Templates(directory=ROOT_DIR / "static" / "templates")


@router.get("/")
def inicio(request: Request):
    return templates.TemplateResponse(
        "paginaInicial.html",
        {"request": request}
    )


@router.get("/registro")
def registro(request: Request):
    return templates.TemplateResponse(
        "index.html",
        {"request": request}
    )


@router.get("/dashboard")
def dashboard(request: Request):
    return templates.TemplateResponse(
        "dashboard.html",
        {
            "request": request,
            "paginaActiva": "dashboard"
        }
    )


@router.get("/movimientos")
def movimientos(request: Request):
    return templates.TemplateResponse(
        "movimientos.html",
        {
            "request": request,
            "paginaActiva": "movimientos"
        }
    )