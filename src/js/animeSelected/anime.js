const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const infoSuperiorSection = document.getElementById("anime-info-superior-section");
const infoMiddleSection = document.getElementById("anime-info-middle-section");

const toggleMenu = () =>{
    modal.classList.toggle("visible-modal");
    lateralMenu.classList.toggle("visible-menu");
    document.body.style.overflow = (modal.classList.contains("visible-modal") ? "hidden" : "scroll")
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
                            <img src="${serie.images["webp"].large_image_url}" alt="anime-portada">
                        </div>

                        <div class="anime-card-info">
                            <div class="score-cont">
                                <div class="logo-score-cont">
                                    <i class="fa-solid fa-arrow-trend-up"></i>
                                </div>
                                <span class="score">${serie.score}</span>
                            </div>

                            <div class="ranked-cont">
                                <span class="ranked"><b>Ranked:</b> #${serie.rank}</span>
                            </div>

                            <div class="season-cont">
                                <span class="season"><b>Season:</b> ${serie.season} ${serie.year}</span>
                            </div>

                            <div class="studio-cont">
                                <span class="studio"><b>Studio:</b> ${serie.studios[0].name}</span>
                            </div>

                            <div class="buttons-cont">
                                <button class="favorite-button">
                                    <span class="logo">
                                        <i class="fa-solid fa-heart"></i>
                                    </span>
                                    <span class="title-button">Favorites</span>
                                </button>

                                <div class="score-input-cont">
                                    <input type="number" id="score-input" class="score-input" min="0" max="10" maxlength="2" placeholder="score">
                                    <button class="submit-score">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
`
    infoSuperiorSection.appendChild(infoSuperiorContainer);
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
                            <p class="synopsis">
                                ${(serie.synopsis != null) ? serie.synopsis  : "?"}
                            </p>
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
                                <span class="info-anime-text-cont"><b>Producers:</b> ${ (serie.producers[0].name != null) ? serie.producers[0].name : "?" }, ${(serie.producers.length > 1 && serie.producers[1].name != null) ? serie.producers[1].name : ""}, ${(serie.producers.length > 2 && serie.producers[2].name != null) ? serie.producers[2].name : ""}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Licensors:</b> Funimation, 4Kids Entertainment</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Studios:</b> ${(serie.studios.length > 0 && serie.studios[0].name != null) ? serie.studios[0].name  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Source:</b> ${(serie.source != null) ? serie.source  : "?"}</span>
                            </div>
                            <div class="info-anime-cont">
                                <span class="info-anime-text-cont"><b>Genres:</b> Action,Adventure, Fantasy</span>
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
}

const loadInfoSection = async (serieId) => {
    const url = `https://api.jikan.moe/v4/anime/${serieId}`
    
    try {
        let response = await fetch(url);

        let data = await response.json();

        drawSuperiorSection(data.data);
        drawMiddleSection(data.data);
    } catch (error) {
        console.log(error)
    }
}

const loadInfo = () => {
    const getSerieId = localStorage.getItem("idSerieActual");

    loadInfoSection(getSerieId);
}

modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
document.addEventListener("DOMContentLoaded", loadInfo())
/* 
                    

                    


*/


/*

-Terminar la seccion de info

-Hacer la seccion de personajes

-agregar logica del acordion

-agregar logica para abrir modal 

-agregar logica para mostrar los datos en el modal

-agregar la logica para guardar a las series

*/