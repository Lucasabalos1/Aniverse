const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const infoSuperiorSection = document.getElementById("anime-info-superior-section");
const infoMiddleSection = document.getElementById("anime-info-middle-section");
const infoInferiorSection = document.getElementById("characters-cont");
const userId = localStorage.getItem("sesionActual");
const getSerieId = localStorage.getItem("idSerieActual");

const toggleMenu = () =>{
    modal.classList.toggle("visible-modal");
    lateralMenu.classList.toggle("visible-menu");
    document.body.style.overflow = (modal.classList.contains("visible-modal") ? "hidden" : "scroll")
}

const toggleAcordion = () => {
    document.querySelector(".synopsis-paragraph-cont").classList.toggle("show-acordion");
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
            let response = await fetch(url);
            
            let data = await response.json();

            const serie = {
                serie_id: data.data.mal_id,
                name: data.data.title,
                image: data.data.images["webp"].large_image_url,
                score: "0"
            };

            return serie;
        } catch (error) {
            console.log(error);
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
        toggleFavoriteButton();
        // Lógica para eliminar la serie ya incluida
        let index = user.series.findIndex(serie => serie.serie_id === getSerie.serie_id);
        if (index !== -1) {
            user.series.splice(index, 1);
        }

        localStorage.setItem("seriesPorUsuario", JSON.stringify(storageData));
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

    if (!userId) {
        document.querySelector(".favorite-button").disabled = true;
    }

    document.querySelector(".favorite-button").addEventListener("click", addFavorites);
    document.querySelector(".submit-score").addEventListener("click", submitScore);
        
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

    document.querySelector(".button-expasion").addEventListener("click", toggleAcordion)
}

const drawCharacterCard = (serie) => {
    const character = document.createElement("DIV");

    character.classList.add("character");

    character.innerHTML = `
                            <div class="anime-character-cont">
                                <div class="character-image-cont">
                                    <img src="${serie.character.images["webp"].image_url}" alt="character-image">
                                </div>
                                <div class="character-data">
                                    <span class="character-name">${serie.character.name}</span>
                                    <span class="character-rol">${serie.role}</span>
                                </div>
                            </div>

                            <div class="seiyuu-cont">
                                <div class="seiyuu-data">
                                    <span class="seiyuu-name">${serie.voice_actors[0].person.name}</span>
                                    <span class="seiyuu-nationality">${serie.voice_actors[0].language}</span>
                                </div>
                                <div class="seiyuu-image-cont">
                                    <img src="${serie.voice_actors[0].person.images["jpg"].image_url}" alt="seiyuu-image">
                                </div>
                            </div>
    `
    infoInferiorSection.appendChild(character)
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

const loadCharacterSection = async (serieId) => {
    try {
        const url = `https://api.jikan.moe/v4/anime/${serieId}/characters`

        let response = await fetch(url);

        let data = await response.json();

        let dataLimited = (data.data.length < 10) ? data.data.slice(0,data.data.length) : data.data.slice(0,10); 

        for (let index = 0; index < dataLimited.length; index++) {
            drawCharacterCard(dataLimited[index])
        }
    } catch (error) {
        console.log(error);    
    }

}

const loadInfo = () => {
    loadInfoSection(getSerieId);
    loadCharacterSection(getSerieId);
}

modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);

document.addEventListener("DOMContentLoaded", loadInfo())

/*

-agregar logica para abrir modal 

-agregar logica para mostrar los datos en el modal


A futuro: 
-agregar un boton para mostrar otros 10 personajes 
-agregar que si la serie esta agregada, aparezcan ya los botones de favoritos con los estilos correspondientes al actualizar la pagina
*/