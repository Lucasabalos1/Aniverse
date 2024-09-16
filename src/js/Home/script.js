const swiperWelcomeWrapper = document.getElementById("swiper-welcome-wrapper");
const swiperPopularWrapper = document.getElementById("swiper-popular-wrapper");
const swiperUserListWrapper = document.getElementById("swiper-user-list-wrapper");
const randomSection = document.getElementById("recommendation-random-section");
const popularBtn = document.getElementById("popular-list-button");
const userBtn = document.getElementById("user-list-button");

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

const showMessageEmptyList = () => {
    const userAnimeContainer = document.querySelector(".user-animes-container");

    let message = document.createElement("SPAN");
        
    message.classList.add("message-error");

    message.innerHTML = "Lista de animes favoritos vacia"

    userAnimeContainer.appendChild(message);
}

const redirectUser = (serie) => {
    const getId = serie.querySelector(".anime-id").textContent.trim();
    localStorage.setItem("idSerieActual", getId);
    window.location.href = "../Pages/animeSelected.html";   
}

const redirectWelcome = (serieId) =>{
    localStorage.setItem("idSerieActual", serieId);
    window.location.href = "../Pages/animeSelected.html";   
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

const drawInWelcome = (serie, serieId) => {

    let slide = document.createElement("DIV");

    slide.classList.add("swiper-slide");
    
    slide.innerHTML = `
         <div class="anime-id">${serieId}</div>
         <img src="${serie.images["webp"].large_image_url}" alt="anime-image" loading="lazy">
         <div class="more-info-button-cont">
            <button class="more-info-button" aria-label="more anime info button">More Information</button>
         </div>
         <div class="serie-name-cont">
            <span class="serie-name">${serie.title.toUpperCase()}</span>
         </div>
         <div class ="serie-descr-cont">
            <span class ="description">${serie.synopsis}</span>
         </div>
    `
    swiperWelcomeWrapper.appendChild(slide);

    const moreInfo = slide.querySelector(".more-info-button");

    moreInfo.addEventListener("click", () => redirectWelcome(serieId));
}

const inicializeWelcomeSection = async () => {
    
    const welcomeSeries = [41467,813,21,20];
  
    for (let index = 0; index < welcomeSeries.length; index++) {
        try {
            let response = await fetch(`https://api.jikan.moe/v4/anime/${welcomeSeries[index]}`)
            
            let data =  await response.json();
                        
            drawInWelcome(data.data, welcomeSeries[index])
            
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
        <a class="popular-anime" href="">
            <div class="anime-id">${serie.mal_id}</div>
            <div class="image-swiper-cont">
                <img src="${serie.images["webp"].large_image_url}" alt="popular-image" loading="lazy">
                <div class="anime-title-cont">
                    <span class="anime-title">${serie.title.toUpperCase()}</span>
                </div>
            </div>
        </a>
        `
        swiperPopularWrapper.appendChild(slide);
    });

    const popularAnimes = document.querySelectorAll(".popular-anime");

    popularAnimes.forEach((popularAnime) => {
        popularAnime.addEventListener("click", (event) => {
            event.preventDefault();
            redirectUser(popularAnime);
        });
    });
}

const inicializePopularSection = async () => {
    try {
        let response = await fetch("https://api.jikan.moe/v4/top/anime?limit=12");
        let data = await response.json();
        drawPopularAnime(data.data);
    } catch (error) {
        console.log(`API call failed: ${error.message}. Retrying...`);
        inicializePopularSection();
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
    let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario"));
    let existUser  = storageData.usuarios.some(u => u.user_id === userId);

    if (!existUser) {
        showMessageEmptyList();
        return;
    }

    const user = storageData.usuarios.find(u => u.user_id === userId);

    const getSeries = user.series;

    const getSerieLength = (getSeries.length <= 10 ? getSeries.length : 9)

    for (let index = 0; index < getSerieLength; index++) {
        let slide = document.createElement("DIV");

        slide.classList.add("swiper-slide");

        slide.innerHTML = `
        <a class="user-series" href="">
            <div class="anime-id">${getSeries[index].serie_id}</div>
            <div class="image-swiper-cont">
                <img src="${getSeries[index].image}" alt="popular-image" loading="lazy">
                <div class="anime-title-cont">
                    <span class="anime-title">${getSeries[index].name}</span>
                </div>
            </div>
        </a>
        `
        swiperUserListWrapper.appendChild(slide);
    }
    inicializeSwipperUserList();
    const serieList = document.querySelectorAll(".user-series");
    
    serieList.forEach((serie => {
        serie.addEventListener("click", (event) => {
            event.preventDefault();
            redirectUser(serie);
        })
    }))
}

const drawAnimeRandom = (serie) => {
    if (randomSection.firstElementChild) {
        randomSection.removeChild(randomSection.firstElementChild)
    }

    let randomContainer = document.createElement("DIV");

    randomContainer.classList.add("recommendation-random-container");
    
    randomContainer.innerHTML = `
        <div class="anime-id">${serie.mal_id}</div>
        <div class="anime-background-image">
            <img src="${serie.images["webp"].large_image_url}" alt="random-anime-background" loading="lazy">
        </div>

        <div class="anime-random-cont">
                        
            <div class="anime-random-image-cont">
                <img src="${serie.images["webp"].large_image_url}" alt="anime-random" loading="lazy">
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
                    <button id="generate-anime" aria-label="anime random button generator">Generate anime</button>
                    <button id="more-info-anime" aria-label="more anime info button">More info</button>
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
    });

    document.getElementById("more-info-anime").addEventListener("click", () => {
        redirectUser(randomContainer);
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

popularBtn.addEventListener("click", () => {
    localStorage.setItem("current-list", "popular");
    window.location.href = `Pages/animeList.html`;
})

userBtn.addEventListener("click", () => {
    localStorage.setItem("current-list", "usuario");
    window.location.href = `Pages/animeList.html`;
})

document.addEventListener("DOMContentLoaded", () =>{
    inicializeWelcomeSection();
    inicializePopularSection();
    inicializeUserListSection();
    generateAnimeRandom();
    inicializeAnimation();
});