class SavingGoalController:

    def __init__(self, saving_goal_service):
        self.saving_goal_service = saving_goal_service

    def crear_meta(self, datos):
        return self.saving_goal_service.crear_meta(datos)

    def listar_metas(self, correo):
        return self.saving_goal_service.listar_metas(correo)

    def ocultar_meta(self, meta_id):
        return self.saving_goal_service.ocultar_meta(meta_id)