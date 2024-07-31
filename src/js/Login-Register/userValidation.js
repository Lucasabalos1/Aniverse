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
    // event.preventDefault();

    let storageData = JSON.parse(localStorage.getItem("users")) || { usuarios: [] };

    const getUser = document.getElementById("register-username").value;
    const getPassword = document.getElementById("register-password").value;
    const getconfirmPassword = document.getElementById("register-confirm-password").value;
    
    if (!getUser || !getPassword || !getconfirmPassword) {
        return;
    }
    if (getPassword != getconfirmPassword) {
        alert("las contraseñas no son iguales");
        return;
    }
    
    const userRegister = {
        id: storageData.usuarios.length + 1,
        user: getUser,
        password: getPassword
    }

    storageData.usuarios.push(userRegister);

    localStorage.setItem("users",JSON.stringify(storageData));

    alert("registro con exito")
    toggleForms();
});

submitLoginBtn.addEventListener("click", (event) => {
    // event.preventDefault();

    let storageData = JSON.parse(localStorage.getItem("users"));

    const getUser = document.getElementById("login-username").value;
    const getPassword = document.getElementById("login-password").value;
    const userFound = storageData.usuarios.find(user => user.user === getUser && user.password === getPassword);

    if(userFound){
        console.log("sesion iniciada");
        localStorage.setItem("sesionActual" ,userFound.id)
        location.href = "../index.html"
    }else{
        console.log("no inicio sesion");
    }
});


document.addEventListener("DOMContentLoaded", inicializeAnimations)

loginRedirectBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleForms()
});

registerRedirectBtn.addEventListener("click", (event) => {
    event.preventDefault()
    toggleForms()
});

/*

Cosas a arreglar:

-validar contraseña con minimo
-validar que sean iguales, una vez hecho que recien se pueda realizar el envio
-verificar que no exista el usuario en el register
-verificar que el usuario exista en el login

*/