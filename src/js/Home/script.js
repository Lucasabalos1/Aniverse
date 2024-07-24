const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const swiperWelcomeWrapper = document.getElementById("swiper-welcome-wrapper");
const swiperPopularWrapper = document.getElementById("swiper-popular-wrapper");

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

const inicializeSwipperPopular = () => {
    let swiperPopular = new Swiper(".mySwiperPopular", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        simulateTouch: false,
        slidesPerView: (window.screen.width < 800) ? 2 : 3

      });
}

const inicializeSwipperUserList = () => {
    let swiperPopular = new Swiper(".mySwiperUserList", {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        simulateTouch: false,
        slidesPerView: (window.screen.width < 800) ? 2 : 3

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

const drawPopularAnime = (series) => {
    
    series.forEach(serie => {
        console.log()
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

const inicializeUserListSection = () => {
    //To-do: Falta la logica en la que toma las series dependiendo el id del usuario y las muestra
    
    let storageData = JSON.parse(localStorage.getItem("series"));
    
    if (!storageData) {
        showMessageEmptyList();
    }

    inicializeSwipperUserList()
}



modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
document.addEventListener("DOMContentLoaded", inicializeWelcomeSection);
document.addEventListener("DOMContentLoaded", inicializePopularSection);
document.addEventListener("DOMContentLoaded", inicializeUserListSection)