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

    const correoGuardado = localStorage.getItem("correo");

    if (correo === correoGuardado) {
        mostrarMensaje("Ese correo ya está registrado");
        return;
    }

    localStorage.setItem("usuario", usuario);
    localStorage.setItem("correo", correo);
    localStorage.setItem("password", password);

    mostrarMensaje("Usuario registrado correctamente");
    limpiarRegistro();
}

function login() {
    const correo = obtenerValor("correoLogin");
    const password = obtenerValor("passwordLogin");

    const error = validarDatosLogin(correo, password);

    if (error) {
        mostrarMensaje(error);
        return;
    }

    const correoGuardado = localStorage.getItem("correo");
    const passwordGuardado = localStorage.getItem("password");

    if (correo !== correoGuardado || password !== passwordGuardado) {
        mostrarMensaje("Correo o contraseña incorrectos");
        return;
    }

    window.location.href = "/dashboard";
}