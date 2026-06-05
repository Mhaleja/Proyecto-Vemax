// SRP:
// Este archivo se encarga solo de la lógica de registro e inicio de sesión.
// Así el HTML queda encargado únicamente de mostrar la estructura de la página.

function obtenerValor(id) {
    return document.getElementById(id).value.trim();
}

function validarUsuario(usuario) {
    return /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,40}$/.test(usuario);
}

function validarCorreo(correo) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo);
}

function validarPassword(password) {
    const tieneMinimo = password.length >= 8;
    const tieneMayuscula = /[A-ZÁÉÍÓÚÑ]/.test(password);
    const tieneMinuscula = /[a-záéíóúñ]/.test(password);
    const tieneNumero = /\d/.test(password);
    const tieneSimbolo = /[^A-Za-zÁÉÍÓÚáéíóúÑñ0-9]/.test(password);

    return tieneMinimo && tieneMayuscula && tieneMinuscula && tieneNumero && tieneSimbolo;
}

function mostrarMensaje(mensaje) {
    alert(mensaje);
}

function limpiarRegistro() {
    document.getElementById("usuario").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("password").value = "";
}

function validarDatosRegistro(usuario, correo, password) {
    if (!usuario || !correo || !password) {
        return "Completa todos los campos";
    }

    if (!validarUsuario(usuario)) {
        return "El usuario debe tener solo letras y espacios, entre 3 y 40 caracteres";
    }

    if (!validarCorreo(correo)) {
        return "Ingresa un correo electrónico válido. Ejemplo: usuario@correo.com";
    }

    if (!validarPassword(password)) {
        return "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula, un número y un símbolo";
    }

    return null;
}

function validarDatosLogin(correo, password) {
    if (!correo || !password) {
        return "Completa todos los campos";
    }

    if (!validarCorreo(correo)) {
        return "Ingresa un correo electrónico válido";
    }

    return null;
}

function registrar() {
    const usuario = obtenerValor("usuario");
    const correo = obtenerValor("correo");
    const password = obtenerValor("password");

    const error = validarDatosRegistro(usuario, correo, password);

    if (error) {
        mostrarMensaje(error);
        return;
    }

    fetch("/auth/registro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario,
            correo: correo,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("RESPUESTA:", data);

        mostrarMensaje(data.mensaje);

        if (data.correo) {
            limpiarRegistro();

            const Form = document.getElementById("form");
            const Banner = document.getElementById("banner");

            Form.classList.remove("toggle");
            Banner.classList.remove("toggle");
        }
    })
    .catch(err => {
        console.error(err);
        mostrarMensaje("Error en registro");
    });
}

function login() {
    const correo = obtenerValor("correoLogin");
    const password = obtenerValor("passwordLogin");

    const error = validarDatosLogin(correo, password);

    if (error) {
        mostrarMensaje(error);
        return;
    }

    fetch("/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            correo: correo,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        mostrarMensaje(data.mensaje);

        if (data.correo) {
            Session.guardar(data.usuario, data.correo);
            window.location.href = "/dashboard";
        }
    })
    .catch(() => {
        mostrarMensaje("Error al iniciar sesión");
    });
}