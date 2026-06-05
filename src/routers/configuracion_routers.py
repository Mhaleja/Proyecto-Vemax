from fastapi import APIRouter, Request
from fastapi.templating import Jinja2Templates

router = APIRouter()

templates = Jinja2Templates(directory="static/templates")

@router.get("/configuracion")
def configuracion(request: Request):
    return templates.TemplateResponse(
        "configuracion.html",
        {"request": request}
    )