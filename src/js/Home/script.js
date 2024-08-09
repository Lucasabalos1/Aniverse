/*
Obtener por generos
https://api.jikan.moe/v4/anime?genres=1&limit=20*/

const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const swiperWelcomeWrapper = document.getElementById("swiper-welcome-wrapper");
const swiperPopularWrapper = document.getElementById("swiper-popular-wrapper");
const swiperUserListWrapper = document.getElementById("swiper-user-list-wrapper")
const randomSection = document.getElementById("recommendation-random-section");
const formBtn = document.getElementById("send-button");
const userId = localStorage.getItem("sesionActual");

const inicializeAnimation = () => {

    window.sr = ScrollReveal();

    sr.reveal("header", {
        duration:500,
        origin: `bottom`,
        distance: `-100px`
    })

    sr.reveal(swiperWelcomeWrapper, {
        duration: 1000,
        scale: 0.9
    })

    sr.reveal(".anime-popular-container", {
        duration: 1000,
        origin: `left`,
        distance: `-100px`
    })

    sr.reveal(".user-animes-container", {
        duration: 1000,
        origin: `right`,
        distance: `-100px`
    })
}


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

const drawInWelcome = (serie, description) => {

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
         <div class ="serie-descr-cont">
            <span class = "description">${description}</span>
         </div>
    `
    swiperWelcomeWrapper.appendChild(slide);
}

const inicializeWelcomeSection = async () => {
    
    const welcomeSeries = [41467,813,21,20];
    const descriptionSeries = [
        "Sigue a Ichigo Kurosaki, un adolescente que puede ver fantasmas. Su vida cambia cuando conoce a Rukia Kuchiki, una Segadora de Almas, y recibe sus poderes para proteger a su familia de un Hollow, un espíritu maligno. Ahora, como un Segador de Almas sustituto, Ichigo debe defender a los vivos y a los muertos, enfrentando a poderosos enemigos y desentrañando secretos del mundo espiritual.",
        "Sigue las aventuras de Goku, un poderoso guerrero Saiyajin, y sus amigos mientras defienden la Tierra de amenazas cósmicas. A lo largo de la serie, Goku y sus aliados enfrentan a enemigos formidables como Vegeta, Freezer, Cell y Majin Buu. La serie destaca por sus intensas batallas, transformaciones épicas y la búsqueda de las esferas del dragón, que pueden conceder cualquier deseo.",
        "Sigue a Monkey D. Luffy, un joven pirata con habilidades elásticas tras comer una Fruta del Diablo. Junto a su tripulación, los Piratas del Sombrero de Paja, Luffy navega en busca del legendario tesoro One Piece para convertirse en el Rey de los Piratas. En su travesía, enfrentan peligros y enemigos mientras exploran el vasto mar de la Gran Línea.",
        "Sigue la historia de Naruto Uzumaki, un joven ninja con el sueño de convertirse en el Hokage, el líder de su aldea. A pesar de ser rechazado y solitario debido al demonio zorro de nueve colas sellado dentro de él, Naruto lucha por ganarse el respeto de los demás y demostrar su valía. A lo largo de su viaje, forma profundas amistades, enfrenta peligrosos enemigos y enfrenta desafíos personales mientras busca alcanzar su sueño y proteger a sus seres queridos."
    ]

    for (let index = 0; index < welcomeSeries.length; index++) {
        try {
            let response = await fetch(`https://api.jikan.moe/v4/anime/${welcomeSeries[index]}`)
            
            let data =  await response.json();
                        
            drawInWelcome(data.data, descriptionSeries[index])
            
        } catch (error) {
            console.log(error);
            index = index - 1;
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
    
    let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario"));
    
    if (!storageData) {
        showMessageEmptyList();
    }

    const user = storageData.usuarios.find(u => u.user_id === userId);

    const getSeries = user.series;

    console.log(getSeries)
    for (let index = 0; index < getSeries.length; index++) {
        let slide = document.createElement("DIV");

        slide.classList.add("swiper-slide");

        slide.innerHTML = `
        <a href="">
            <div class="image-swiper-cont">
                <img src="${getSeries[index].image}" alt="popular-image">
                <div class="anime-title-cont">
                    <span class="anime-title">${getSeries[index].name}</span>
                </div>
            </div>
        </a>
        `
        swiperUserListWrapper.appendChild(slide);
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

            <div class="info-anime-random">
         
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
    inicializeAnimation();
    if (userId) {
        document.querySelector(".link-cont").classList.toggle("hidden-toggle");
        document.querySelector(".user-info-cont").classList.toggle("hidden-toggle");
        document.querySelector(".link-cont-mobile").classList.toggle("hidden-toggle");
        document.querySelector(".user-info-cont-mobile").classList.toggle("hidden-toggle");
    }
});

/* Separa lo que se usa globalmente en un js aparte como el envio de emails y el modal del submenu 
   Agregarles un id a las series que este oculto
   Agregar logica para redirigir a la pagina de una serie
   Arreglar los bugs de las llamadas a la api
*/