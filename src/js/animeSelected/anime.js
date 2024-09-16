const infoSuperiorSection = document.getElementById("anime-info-superior-section");
const infoMiddleSection = document.getElementById("anime-info-middle-section");
const infoInferiorSection = document.getElementById("characters-cont");
const getSerieId = localStorage.getItem("idSerieActual");
let swiper;
window.sr = ScrollReveal();


const toggleAcordion = () => {
    document.querySelector(".synopsis-paragraph-cont").classList.toggle("show-acordion");
}

const inicializeAnimations = () =>{
    sr.reveal("header", {
        duration:1000,
        origin: `bottom`,
        distance: `-100px`
    })
}

const toggleFavoriteButton = () => {
    const scoreCont = document.querySelector(".score-input-cont");
    const heartLogo = document.querySelector(".logo");
    scoreCont.classList.toggle("add-favorites");
    heartLogo.classList.toggle("red-heart");
}

const createSerie = async(serieId) =>{
        const url = `https://api.jikan.moe/v4/anime/${serieId}`;

        try {
            const data = await callForApi(url);


            const serie = {
                serie_id: data.mal_id,
                image: data.images["webp"].large_image_url,
                name: data.title,
                type:data.type ,
                episodes: (data.episodes != null)  ? data.episodes : "?",
                score: "0"
            };

            return serie;
        } catch (error) {
            console.log(error);
        }
}

const verifySerieInclude = () => {
    let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario"));

    if(!storageData){
        return;
    }

    let user = storageData.usuarios.find(u => u.user_id === userId);

    let isSerieExists = user.series.some(s => s.serie_id === parseInt(getSerieId));

    if (isSerieExists) {
        toggleFavoriteButton();
    }

}

const addFavorites = async () => {
    let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario")) || {usuarios:[]};
    
    let user = storageData.usuarios.find(u => u.user_id === userId);

    if(!user){
        user = {
            user_id: userId,
            series:[]
        };

        storageData.usuarios.push(user);
    }

    const getSerie = await createSerie(getSerieId);

    const isSerieIncluded = user.series.some(serie => serie.serie_id === getSerie.serie_id);

    if (isSerieIncluded) {
        let index = user.series.findIndex(serie => serie.serie_id === getSerie.serie_id);
 
        if (index !== -1) {
            user.series.splice(index, 1);
        }

        localStorage.setItem("seriesPorUsuario", JSON.stringify(storageData));
        toggleFavoriteButton();
        return;
    }

    user.series.push(getSerie);
    
    localStorage.setItem("seriesPorUsuario", JSON.stringify(storageData));

    toggleFavoriteButton();
}

const submitScore = () =>{
    const getScore = document.getElementById("score-input").value;

    let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario"));

    let user = storageData.usuarios.find(u => u.user_id === userId);

    let serie = user.series.find(s => s.serie_id === parseInt(getSerieId));

    serie.score = getScore;

    localStorage.setItem("seriesPorUsuario", JSON.stringify(storageData));

    alert("puntaje agregado")
} 

const drawSuperiorSection = (serie) => {
    const infoSuperiorContainer = document.createElement("DIV");

    infoSuperiorContainer.classList.add("anime-info-superior-container");

    infoSuperiorContainer.innerHTML = `
                        <div class="anime-title-cont">
                            <span class="anime-title">${serie.title.toUpperCase()}</span>
                        </div>

                        <hr>

                        <div class="anime-card">
                            <div class="anime-image">
                                <img src="${serie.images["webp"].large_image_url}" alt="anime-portada" loading="lazy" width="100%" height="auto">
                            </div>

                            <div class="anime-card-info">
                                <div class="info-stats-cont">
                                    <div class="score-cont">
                                        <div class="logo-score-cont">
                                            <i class="fa-solid fa-arrow-trend-up"></i>
                                        </div>
                                        <span class="score">${(serie.score != null) ? serie.score : "N/A"}</span>
                                    </div>

                                    <div class="ranked-cont">
                                        <span class="ranked"><b>Ranked:</b> #${(serie.rank != null) ? serie.rank : "?"}</span>
                                    </div>

                                    <div class="season-cont">
                                        <span class="season"><b>Season:</b> ${(serie.season!= null) ? serie.season: "?"} ${(serie.year != null) ? serie.year: "?"}</span>
                                    </div>

                                    <div class="studio-cont">
                                        <span class="studio"><b>Studio:</b> ${(serie.studios.length > 0 && serie.studios[0].name != null) ? serie.studios[0].name : "?"}</span>
                                    </div>
                                </div>
                                <div class="buttons-cont">
                                    <button class="favorite-button" aria-label="add anime favorite">
                                        <span class="logo">
                                            <i class="fa-solid fa-heart"></i>
                                        </span>
                                        <span class="title-button">Favorites</span>
                                    </button>

                                    <div class="score-input-cont">
                                        <input type="number" id="score-input" class="score-input" min="0" max="10" maxlength="2" placeholder="score">
                                        <button class="submit-score" aria-label="submit anime score">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
    `
    infoSuperiorSection.appendChild(infoSuperiorContainer);

    if (!userId) {
        document.querySelector(".favorite-button").disabled = true;
    }

    document.querySelector(".favorite-button").addEventListener("click", addFavorites);
    document.querySelector(".submit-score").addEventListener("click", submitScore);
    document.title = serie.title;
            
    verifySerieInclude();

    sr.reveal(infoSuperiorContainer, {
        duration: 1500,
        scale: 0.9
    })
}

const drawMiddleSection = (serie) =>{
    const infoMiddleContainer = document.createElement("DIV");

    infoMiddleContainer.classList.add("anime-info-middle-container");

    infoMiddleContainer.innerHTML = `
                    <div class="synopsis-cont">
                        <div class="synopsis-title-cont">
                            <span class="synopsis-title">SYNOPSIS</span>
                        </div>
    
                        <hr>
    
                        <div class="synopsis-paragraph-cont">
                            <p class="synopsis">${(serie.synopsis != null) ? serie.synopsis  : "?"}</p>
                            <div class="button-expasion">
                                <i class="fa-solid fa-arrow-right "></i>
                            </div>
                        </div>
                    </div>

                    <div class="more-info-cont">
                        <div class="more-info-title-cont">
                            <span class="more-info-title">More info</span>
                        </div>

                        <hr>

                        <div class="more-info-anime">

                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Type:</b> ${(serie.type != null) ? serie.type  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Episodes:</b> ${(serie.episodes != null) ? serie.episodes :"?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Status:</b> ${(serie.status != null) ? serie.status  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Aired:</b> ${(serie.aired.string != null) ? serie.aired.string  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Premiere:</b> ${(serie.season != null) ? serie.season  : "?"} ${serie.year}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Broadcast:</b> ${(serie.broadcast.string != null) ? serie.broadcast.string  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Producers:</b> ${ (serie.producers.length > 0 && serie.producers[0].name != null) ? serie.producers[0].name : "?" }, ${(serie.producers.length > 1 && serie.producers[1].name != null) ? serie.producers[1].name : ""}, ${(serie.producers.length > 2 && serie.producers[2].name != null) ? serie.producers[2].name : ""}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Licensors:</b> ${(serie.licensors.length > 0 && serie.licensors[0].name != null) ? serie.licensors[0].name : "?"}, ${(serie.licensors.length > 1 && serie.licensors[0].name != null) ? serie.licensors[1].name : ""}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Studios:</b> ${(serie.studios.length > 0 && serie.studios[0].name != null) ? serie.studios[0].name  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Source:</b> ${(serie.source != null) ? serie.source  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Genres:</b> ${(serie.genres.length > 0 && serie.genres[0].name != null) ? serie.genres[0].name : "?" }, ${(serie.genres.length > 1 && serie.genres[1].name != null) ? serie.genres[1].name : "" }, ${(serie.genres.length > 2 && serie.genres[2].name != null) ? serie.genres[2].name : "" }</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Demographic:</b> ${(serie.demographics.length > 0 && serie.demographics[0].name != null) ? serie.demographics[0].name : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Duration:</b> ${(serie.duration != null) ? serie.duration  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Rating:</b> ${(serie.rating != null) ? serie.rating  : "?"}</span>
                            </div>
                        </div>
                    </div>

    `

    infoMiddleSection.appendChild(infoMiddleContainer);

    document.querySelector(".button-expasion").addEventListener("click", toggleAcordion);
}

const drawCharacterCard = (serie) => {
    const character = document.createElement("DIV");

    character.classList.add("character");

    character.innerHTML = `
                            <div class="anime-character-cont">
                                <div class="character-id">${serie.character.mal_id}</div>

                                <div class="character-image-cont">
                                    <img src="${serie.character.images["webp"].image_url}" alt="character-image" loading="lazy" width="100%" height="auto">
                                </div>
                                <div class="character-data">
                                    <span class="character-name">${serie.character.name}</span>
                                    <span class="character-rol">${serie.role}</span>
                                </div>
                            </div>

                            <div class="seiyuu-cont">
                                <div class="seiyuu-data">
                                    <span class="seiyuu-name">${(serie.voice_actors.length > 0) ? serie.voice_actors[0].person.name : ""}</span>
                                    <span class="seiyuu-nationality">${(serie.voice_actors.length > 0) ? serie.voice_actors[0].language : ""}</span>
                                </div>
                                <div class="seiyuu-image-cont">
                                    <img src="${(serie.voice_actors.length > 0) ? serie.voice_actors[0].person.images["jpg"].image_url : ""}" alt="seiyuu-image" loading="lazy" width="100%" height="auto">
                                </div>
                            </div>
    `
    infoInferiorSection.appendChild(character)
}

const loadInfoSection = async (serieId) => {
    const url = `https://api.jikan.moe/v4/anime/${serieId}`
    try {
        const data = await callForApi(url);
        drawSuperiorSection(data);
        drawMiddleSection(data);
    } catch (error) {
        console.log(error)
    }
}

const toggleCharacterModal = () =>{
    const modalCharacterCont = document.getElementById("modal-galery-container");

    modalCharacterCont.classList.toggle("visible");

    document.body.style.overflow = (modalCharacterCont.classList.contains("visible") ? "hidden" : "scroll");
}

const drawSwipperGalery = async(url) =>{
    try {
        const data = await callForApi(url);

        const swiperGallery = document.querySelector(".swiper-wrapper");

        swiperGallery.innerHTML = "";

        for (let index = 0; index < data.length; index++) {
            let slide = document.createElement("DIV");

            slide.classList.add("swiper-slide");

            slide.innerHTML = `<img src="${data[index].jpg.image_url}" alt="character-image" loading="lazy" width="100%" height="auto">`

            swiperGallery.appendChild(slide);
        }

        if (swiper) {
            swiper.destroy(true, true);
        }

        swiper = new Swiper(".mySwiper", {
            autoplay:{
                delay:1500,
                disableOnInteraction:false
            },
            simulateTouch: false,
        });
        

    } catch (error) {
        console.log(error)
    }
}

const drawCharacterInfo = async(url) => {   
    try {
        const data = await callForApi(url);

        const dataCharacterContainer = document.querySelector(".character-data-cont");

        dataCharacterContainer.innerHTML = "";

        let info = document.createElement("DIV");

        info.classList.add("info-character");

        let about = data.about;

        info.innerHTML = `
                <div class="info-character-cont">
                    <p class="info-character-text">${(about != null) ? about : "No character info"}</p>
                </div>
        `
        dataCharacterContainer.appendChild(info);
    } catch (error) {
        console.log(error)
    }
}

const createCharacterModal = (characterId) =>{
    const urlCharacterInfo = `https://api.jikan.moe/v4/characters/${characterId}`
    const urlPictures = `https://api.jikan.moe/v4/characters/${characterId}/pictures`;

    drawSwipperGalery(urlPictures);
    drawCharacterInfo(urlCharacterInfo);
    toggleCharacterModal();
    document.querySelector(".close-character-btn").addEventListener("click", toggleCharacterModal)

}

const inicializeCharacters = (characters) =>{

    characters.forEach((characterSelected) => {
        characterSelected.addEventListener("click", () => {
            console.log(characterSelected)
            const characterId = characterSelected.firstElementChild.innerHTML;
            createCharacterModal(characterId)
        });
    });
}

const loadCharacterSection = async (serieId,start,end) => {
    try {
        const url = `https://api.jikan.moe/v4/anime/${serieId}/characters`

        const data = await callForApi(url);

        let dataLimited = data.slice(start, end); 

        infoInferiorSection.innerHTML = "";

        for (let index = 0; index < dataLimited.length; index++) {
            drawCharacterCard(dataLimited[index]);
        }

        const getAllCharacters = document.querySelectorAll(".anime-character-cont")

        inicializeCharacters(getAllCharacters);
    } catch (error) {
        console.log(error);    
    }
}

const loadInfo = () => {
    loadInfoSection(getSerieId);
    loadCharacterSection(getSerieId, 0, 10);
}

const loadMoreCharacters = () =>{
    const init = document.querySelectorAll(".character").length;
    loadCharacterSection(getSerieId,0, init+10)
}

document.addEventListener("DOMContentLoaded",loadInfo);
document.addEventListener("DOMContentLoaded", inicializeAnimations);
document.querySelector(".more-character-btn").addEventListener("click", loadMoreCharacters);

/*
A futuro: 
Reestructurar la seccion de characters
*/