const registerContainer = document.querySelector(".register-container");
const loginContainer = document.querySelector(".login-container");

const registerRedirectBtn = document.querySelector(".register-redirect");
const loginRedirectBtn = document.querySelector(".login-redirect");


const toggleForms = () => {
    registerContainer.classList.toggle("hide-form")
    loginContainer.classList.toggle("hide-form")
}

const inicializeAnimations = () => {

    window.sr = ScrollReveal();

    sr.reveal(registerContainer, {
        duration: 1000,
        scale:0.95,
    });

    sr.reveal(loginContainer, {
        duration: 1000,
        scale:0.95,
    });
}

document.addEventListener("DOMContentLoaded", inicializeAnimations)

loginRedirectBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleForms()
});

registerRedirectBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleForms()
});
