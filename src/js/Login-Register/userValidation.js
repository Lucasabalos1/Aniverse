const registerContainer = document.querySelector(".register-container");
const loginContainer = document.querySelector(".login-container");

const registerRedirectBtn = document.querySelector(".register-redirect");
const loginRedirectBtn = document.querySelector(".login-redirect");

const submitLoginBtn = document.getElementById("submit-login-button");
const submitRegisterBtn = document.getElementById("submit-register-button");

const toggleForms = () => {
    registerContainer.classList.toggle("hide-form")
    loginContainer.classList.toggle("hide-form")
}

const inicializeAnimations = () => {

    window.sr = ScrollReveal();

    sr.reveal(loginContainer, {
        duration: 1000,
        scale:0.95,
    });
}

submitRegisterBtn.addEventListener("click", (event) => {
    const registerForm = document.getElementById("register-form");

    if (!registerForm.checkValidity()) {
        registerForm.reportValidity(); 
        event.preventDefault(); 
        return;
    }
    
    let storageData = JSON.parse(localStorage.getItem("users")) || { usuarios: [] };
    const getUser = document.getElementById("register-username").value;
    const getPassword = document.getElementById("register-password").value;
    const getconfirmPassword = document.getElementById("register-confirm-password").value;

    if (getPassword != getconfirmPassword) {
        alert("las contraseñas no son iguales");
        event.preventDefault(); 
        return;
    }
    
    const userRegister = {
        id: storageData.usuarios.length + 1,
        user: getUser,
        password: getPassword
    }

    const userFound = storageData.usuarios.find(user => user.user === getUser && user.password === getPassword);

    if (userFound) {
        alert("El usuario ya existe")
        event.preventDefault();
        return;
    }

    storageData.usuarios.push(userRegister);

    localStorage.setItem("users",JSON.stringify(storageData));

    alert("registro con exito")
    toggleForms();
});

submitLoginBtn.addEventListener("click", (event) => {
    const loginForm = document.getElementById("login-form");

    if (!loginForm.checkValidity()) {
        loginForm.reportValidity(); 
        event.preventDefault(); 
        return;
    }

    let storageData = JSON.parse(localStorage.getItem("users"));

    const getUser = document.getElementById("login-username").value;
    const getPassword = document.getElementById("login-password").value;
    const userFound = storageData.usuarios.find(user => user.user === getUser && user.password === getPassword);

    if(userFound){
        console.log("sesion iniciada");
        localStorage.setItem("sesionActual" ,userFound.id)
        event.preventDefault();
        location.href = "../index.html"
    }else{
        console.log("El usuario no existe");
    }
});


const inputControler = () => {
    const getInputPassword = document.getElementById("register-password"); 
    const getInputPasswordConfirm = document.getElementById("register-confirm-password");
    const getColor = (getInputPassword.value != getInputPasswordConfirm.value) ? "#FF0000" : "#008000";
    
    getInputPasswordConfirm.style.border = `1px solid ${getColor}`
    getInputPassword.style.border = `1px solid ${getColor}`;
}

document.getElementById("register-password").addEventListener("input", inputControler);
document.getElementById("register-confirm-password").addEventListener("input", inputControler);

document.addEventListener("DOMContentLoaded", inicializeAnimations)

loginRedirectBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleForms()
});

registerRedirectBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleForms()
});