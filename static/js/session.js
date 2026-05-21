/* ============================================
   SESIÓN
============================================ */

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

document.addEventListener("DOMContentLoaded", () => {

    const datos = Session.obtener();

    document.getElementById("userName").textContent =
        datos.usuario || "Usuario";

    document.getElementById("userFullName").textContent =
        datos.usuario || "Usuario";

    document.getElementById("userEmail").textContent =
        datos.correo || "correo@gmail.com";

});


/* ============================================
   CERRAR SESIÓN
============================================ */

function cerrarSesion() {
    Session.cerrar();
}