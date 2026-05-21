/* ============================================
   SESSION SERVICE
============================================ */

const Session = {

    obtener() {
        return {
            usuario: localStorage.getItem("usuario"),
            correo: localStorage.getItem("correo")
        };
    },

    cerrar() {
        localStorage.removeItem("usuario");
        localStorage.removeItem("correo");
    }
};


/* ============================================
   CARGAR DATOS DEL USUARIO
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    const datos = Session.obtener();

    if(datos.usuario){
        document.getElementById("userName").textContent =
            datos.usuario;

        document.getElementById("userFullName").textContent =
            datos.usuario;
    }

    if(datos.correo){
        document.getElementById("userEmail").textContent =
            datos.correo;
    }

});


/* ============================================
   CERRAR SESIÓN
============================================ */

function cerrarSesion() {

    Session.cerrar();

    window.location.href="/";

}