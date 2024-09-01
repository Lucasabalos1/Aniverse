const userId = localStorage.getItem("sesionActual");
const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const formBtn = document.getElementById("send-button");
const searchBtns = document.querySelectorAll(".search-button");
const genres = document.querySelectorAll(".genre");
const searchActual = localStorage.getItem("serieSearch");
const genreActual = localStorage.getItem("genreActual")

const toggleMenu = () =>{
    modal.classList.toggle("visible-modal");
    lateralMenu.classList.toggle("visible-menu");
    document.body.style.overflow = (modal.classList.contains("visible-modal") ? "hidden" : "scroll")
}

const callForApi = async(url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data.data;
}

const closeSesion = () => {
    localStorage.removeItem("sesionActual");
    location.reload();
}

const verifyMail = () => {
    const email = document.getElementById("email_input").value;
    return ["@gmail.com", "@hotmail.com", "@outlook"].some(domain => email.includes(domain));
}

document.getElementById("form").addEventListener("submit", (event) => {
    event.preventDefault();

    if (!verifyMail()) {
        alert("Por favor, ingrese un correo electrónico válido con uno de los siguientes dominios: @gmail.com/.ar, @outlook.com/.ar, @hotmail.com/.ar");
        return;
    }
    
    formBtn.value = "ENVIANDO EMAIL...";

    const serviceID = 'default_service';
    const templateID = 'template_98e401c';

    emailjs.sendForm(serviceID, templateID, document.getElementById("form"))
    .then(() => {
        formBtn.value = 'ENVIAR EMAIL';
        console.log('Correo enviado exitosamente!');
        alert('Email mandado!');
      }, (err) => {
        formBtn.value = 'ENVIAR EMAIL';
        console.log('Correo no enviado!');
        alert(JSON.stringify(err));
      });
})

searchBtns.forEach((searchbtn) => {
    searchbtn.addEventListener("click", () => {
        const getParent = searchbtn.parentElement; 

        const getInputSearch = getParent.querySelector(".serieInput").value
        
        localStorage.setItem("serieSearch", getInputSearch);
        localStorage.setItem("genreActual", "")

        window.location.href = `../Pages/searchPage.html`;
    })
});

const getGenreId = async(genreName) => {
    const url = `https://api.jikan.moe/v4/genres/anime`;

    const response = await fetch(url);

    const data = await response.json();

    const getGen = data.data.find(gen => gen.name === genreName)

    return getGen.mal_id;
}

const getGenreName = async(genreId) => {
    const url = `https://api.jikan.moe/v4/genres/anime`;

    const response = await fetch(url);

    const data = await response.json();

    const getGen = data.data.find(gen => gen.mal_id === parseInt(genreId))

    return getGen.name;
}

genres.forEach((genre) => {
    genre.addEventListener("click", async() => {
        const getGen = await getGenreId(genre.textContent);

        localStorage.setItem("genreActual", getGen)
        localStorage.setItem("serieSearch", "");

        window.location.href = `../Pages/searchPage.html`;
    });
});


modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
document.addEventListener("DOMContentLoaded", () =>{
    if (userId) {
        document.querySelector(".link-cont").classList.toggle("hidden-toggle");
        document.querySelector(".user-logout-cont").classList.toggle("hidden-toggle");
        document.querySelector(".link-cont-mobile").classList.toggle("hidden-toggle");
        document.querySelector(".user-logout-cont-mobile").classList.toggle("hidden-toggle");
        document.querySelector(".user-logout-cont").addEventListener("click", closeSesion);
        document.querySelector(".user-logout-cont-mobile").addEventListener("click", closeSesion);
    }
});