// SRP:
// Este archivo se encarga solo de la lógica de registro e inicio de sesión.
// Así el HTML queda encargado únicamente de mostrar la estructura de la página.

function registrar() {
    const usuario = document.getElementById("usuario").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!usuario || !correo || !password) {
        alert("Completa todos los campos");
        return;
    }

    // SRP:
    // Aquí validamos si el correo ya existe antes de guardar el usuario.
    const correoGuardado = localStorage.getItem("correo");

    if (correo === correoGuardado) {
        alert("Ese correo ya está registrado");
        return;
    }

    // Por ahora usamos localStorage como almacenamiento temporal del frontend.
    localStorage.setItem("usuario", usuario);
    localStorage.setItem("correo", correo);
    localStorage.setItem("password", password);

    alert("Usuario registrado correctamente");

    document.getElementById("usuario").value = "";
    document.getElementById("correo").value = "";
    document.getElementById("password").value = "";
}

function login() {
    const correo = document.getElementById("correoLogin").value.trim();
    const password = document.getElementById("passwordLogin").value.trim();

    const correoGuardado = localStorage.getItem("correo");
    const passwordGuardado = localStorage.getItem("password");

    if (!correo || !password) {
        alert("Completa todos los campos");
        return;
    }

    if (correo !== correoGuardado || password !== passwordGuardado) {
        alert("Correo o contraseña incorrectos");
        return;
    }

    window.location.href = "/dashboard";
}