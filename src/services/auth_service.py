class AuthService:

    # DIP:
    # Aquí se cumple porque el servicio no crea el repositorio directamente.
    # Solo lo recibe desde afuera y trabaja con él.
    def __init__(self, repository):
        self.repository = repository

    # SRP:
    # Aquí este método solo se encarga del registro, primero valida si el correo ya existe
    # y si no, manda a guardar el usuario.
    def registrar_usuario(self, datos):
        usuario_existente = self.repository.buscar_por_correo(datos.correo)

        if usuario_existente:
            return {"mensaje": "El correo ya esta registrado"}

        self.repository.guardar(datos)

        return {"mensaje": "Usuario registrado con exito"}

    # SRP:
    # Aquí este método solo se encarga del login,
    # busca el usuario y valida si los datos son correctos.
    def login_usuario(self, datos):
        usuario = self.repository.buscar_por_correo(datos.correo)

        if usuario and usuario["password"] == datos.password:
            return {"mensaje": f"Bienvenido {usuario['usuario']}"}

        return {"mensaje": "Datos incorrectos"}