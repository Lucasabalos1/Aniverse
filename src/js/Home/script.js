/*
Obtener por generos
https://api.jikan.moe/v4/anime?genres=1&limit=20*/

const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const swiperWelcomeWrapper = document.getElementById("swiper-welcome-wrapper");
const swiperPopularWrapper = document.getElementById("swiper-popular-wrapper");
const randomSection = document.getElementById("recommendation-random-section");
const formBtn = document.getElementById("send-button");

const toggleMenu = () =>{
    modal.classList.toggle("visible-modal");
    lateralMenu.classList.toggle("visible-menu");
    document.body.style.overflow = (modal.classList.contains("visible-modal") ? "hidden" : "scroll")
}

const showMessageEmptyList = () => {
    const userAnimeContainer = document.querySelector(".user-animes-container");

    let message = document.createElement("SPAN");
        
    message.classList.add("message-error");

    message.innerHTML = "Lista de animes favoritos vacia"

    userAnimeContainer.appendChild(message);
}

const inicializeSwipper = () => {
    let swiper = new Swiper(".mySwiper", {
        spaceBetween: 30,
        pagination: {
            el: ".swiper-pagination",
            clickable: true
        },
        simulateTouch: false,
    });
}

const drawInWelcome = (serie) => {

    let slide = document.createElement("DIV");

    slide.classList.add("swiper-slide");
    
    slide.innerHTML = `
         <img src="${serie.images["webp"].large_image_url}" alt="anime-image">
         <div class="more-info-button-cont">
            <button class="more-info-button"><a href="">More Information</a></button>
         </div>
         <div class="serie-name-cont">
            <span class="serie-name">${serie.title.toUpperCase()}</span>
         </div>
    `
    swiperWelcomeWrapper.appendChild(slide);
}

const inicializeWelcomeSection = async () => {
    
    const welcomeSeries = [41467,813,21,20];

    for (let index = 0; index < welcomeSeries.length; index++) {
        try {
            let response = await fetch(`https://api.jikan.moe/v4/anime/${welcomeSeries[index]}`)
            
            let data =  await response.json();
                        
            drawInWelcome(data.data)
            
        } catch (error) {
            console.log("La api fallo")
        }
    }
    inicializeSwipper();
};

const inicializeSwipperPopular = () => {
    let swiperPopular = new Swiper(".mySwiperPopular", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        simulateTouch: false,
        slidesPerView: (window.screen.width < 800) ? 2 : 6

      });
}

const drawPopularAnime = (series) => {
    
    series.forEach(serie => {
        let slide = document.createElement("DIV");

        slide.classList.add("swiper-slide");
        
        slide.innerHTML = `
        <a href="">
            <div class="image-swiper-cont">
                <img src="${serie.images["webp"].large_image_url}" alt="popular-image">
                <div class="anime-title-cont">
                    <span class="anime-title">${serie.title.toUpperCase()}</span>
                </div>
            </div>
        </a>
        `
        swiperPopularWrapper.appendChild(slide);
    });
}

const inicializePopularSection = async () => {
    try {
        let response = await fetch("https://api.jikan.moe/v4/top/anime?limit=12");
        let data = await response.json();
        drawPopularAnime(data.data);
    } catch (error) {
        console.log("La api fallo");
    }
    inicializeSwipperPopular();
}

const inicializeSwipperUserList = () => {
    let swiperPopular = new Swiper(".mySwiperUserList", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        simulateTouch: false,
        slidesPerView: (window.screen.width < 800) ? 2 : 6

      });
}

const inicializeUserListSection = () => {
    //To-do: Falta la logica en la que toma las series dependiendo el id del usuario y las muestra
    
    let storageData = JSON.parse(localStorage.getItem("series"));
    
    if (!storageData) {
        showMessageEmptyList();
    }

    inicializeSwipperUserList()
}

const drawAnimeRandom = (serie) => {
    if (randomSection.firstElementChild) {
        randomSection.removeChild(randomSection.firstElementChild)
    }

    let randomContainer = document.createElement("DIV");

    randomContainer.classList.add("recommendation-random-container");
    
    randomContainer.innerHTML = `
    
        <div class="anime-background-image">
            <img src="${serie.images["webp"].large_image_url}" alt="random-anime-background">
        </div>

        <div class="anime-random-cont">
                        
            <div class="anime-random-image-cont">
                <img src="${serie.images["webp"].large_image_url}" alt="anime-random">
            </div>

            <div class="random-anime-title">
                    <span>${serie.title}</span>
            </div>

            <div class="genres-cont">
                <span class="genre">${serie.genres[0]["name"]}</span>
                ${(serie.genres.length == 2) ? `<span class="genre">${serie.genres[1]["name"]}</span>` : "" }
                ${(serie.genres.length > 2) ? `<span class="genre">${serie.genres[2]["name"]}</span>` : "" }
                ${(serie.genres.length > 3) ? `<span class="genre">${serie.genres[3]["name"]}</span>` : "" }
            </div>

            <div class="generate-cont">
                <button id="generate-anime">Generate anime</button>
                <button id="more-info-anime">More info</button>
            </div>

        </div>
    
    `
    randomSection.appendChild(randomContainer);
    document.getElementById("generate-anime").addEventListener("click", generateAnimeRandom);
   

    window.sr = ScrollReveal();
    sr.reveal(".recommendation-random-container",{
        scale: 0.95,    
        duration: 1000,
        reset: true
    })
}

const generateAnimeRandom = async () => {
    try {
        let response = await fetch("https://api.jikan.moe/v4/random/anime");

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let animeRandom = await response.json();

        const isHentai = animeRandom.data.genres.some(genre => genre.name.toLowerCase() === 'hentai');
        if (isHentai) {
            console.log("Hentai genre detected, fetching another anime...");
            generateAnimeRandom(); 
            return;
        }

        drawAnimeRandom(animeRandom.data);
    } catch (error) {
        console.log(`API call failed: ${error.message}. Retrying...`);
        generateAnimeRandom();
    }
};

const verifyMail = () => {
    const email = document.getElementById("email_input").value;
    //El metodo some devuelve true si al menos un elemento cumple la condicion que se pide en la funcion
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

modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
document.addEventListener("DOMContentLoaded", () =>{
    inicializeWelcomeSection();
    inicializePopularSection();
    inicializeUserListSection();
    generateAnimeRandom();
})