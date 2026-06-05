from src.models.saving_goal_entity import SavingGoalEntity


class SavingGoalService:

    def __init__(self, saving_goal_repository, user_repository):
        self.saving_goal_repository = saving_goal_repository
        self.user_repository = user_repository

    def crear_meta(self, datos):
        usuario = self.user_repository.buscar_por_correo(datos.correo)

        if not usuario:
            return {"mensaje": "Usuario no encontrado"}

        nueva_meta = SavingGoalEntity(
            usuario_id=usuario.id,
            nombre=datos.nombre,
            monto_objetivo=datos.monto_objetivo,
            monto_actual=datos.monto_actual
        )

        meta = self.saving_goal_repository.guardar(nueva_meta)

        return {
            "mensaje": "Meta de ahorro guardada con exito",
            "meta": {
                "id": meta.id,
                "nombre": meta.nombre,
                "monto_objetivo": meta.monto_objetivo,
                "monto_actual": meta.monto_actual
            }
        }

    def listar_metas(self, correo):
        usuario = self.user_repository.buscar_por_correo(correo)

        if not usuario:
            return {"metas": []}

        metas = self.saving_goal_repository.listar_por_usuario(usuario.id)

        return {
            "metas": [
                {
                    "id": meta.id,
                    "nombre": meta.nombre,
                    "monto_objetivo": meta.monto_objetivo,
                    "monto_actual": meta.monto_actual
                }
                for meta in metas
            ]
        }

    def ocultar_meta(self, meta_id):
        self.saving_goal_repository.ocultar(meta_id)

        return {
            "mensaje": "Meta de ahorro ocultada"
        }