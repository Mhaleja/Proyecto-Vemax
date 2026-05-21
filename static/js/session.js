/* ============================================
   SESIÓN
============================================ */
// SRP:
// Este archivo se encarga solo de manejar la sesion del usuario.
// Guarda, obtiene y elimina los datos de sesion usando localStorage.

const Session = {

    obtener() {
        return {
            usuario: localStorage.getItem("usuario"),
            correo: localStorage.getItem("correo")
        };
    },

    guardar(usuario, correo) {
        localStorage.setItem("usuario", usuario);
        localStorage.setItem("correo", correo);
    },

    cerrar() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("correo");

        window.location.href = "/";
    }

};


/* ============================================
   CARGAR USUARIO EN DASHBOARD
============================================ */
// SRP:
// Esta parte solo carga los datos guardados del usuario en el dashboard.

document.addEventListener("DOMContentLoaded", () => {

    const datos = Session.obtener();

    const userName = document.getElementById("userName");
    const userFullName = document.getElementById("userFullName");
    const userEmail = document.getElementById("userEmail");

    if (userName) {
        userName.textContent = datos.usuario || "Usuario";
    }

    if (userFullName) {
        userFullName.textContent = datos.usuario || "Usuario";
    }

    if (userEmail) {
        userEmail.textContent = datos.correo || "correo@gmail.com";
    }

});


/* ============================================
   CERRAR SESIÓN
============================================ */
// SRP:
// Esta funcion solo se encarga de cerrar la sesion cuando el usuario presiona el boton.

function cerrarSesion() {
    Session.cerrar();
}