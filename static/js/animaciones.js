// SRP:
// Este archivo se encarga solo de manejar la animacion entre login y registro.
// El HTML mantiene la estructura y aqui cambiamos las clases visuales.

const signIn = document.getElementById('sign-in');
const signUp = document.getElementById('sign-up');
const Form = document.getElementById('form');
const Banner = document.getElementById('banner');

if (signIn && signUp && Form && Banner) {

    signIn.addEventListener('click', () => {
        Form.classList.remove('toggle');
        Banner.classList.remove('toggle');
    });

    signUp.addEventListener('click', () => {
        Form.classList.add('toggle');
        Banner.classList.add('toggle');
    });

}