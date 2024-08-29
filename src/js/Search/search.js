const genresAcordion = document.querySelector(".inferior-acordion-row");
const acordionBtn = document.querySelector(".superior-acordion-row");
const searchInput = document.querySelector(".search-input");
const animeContainer = document.querySelector(".animes-result-cont");

const currentPage = {
    page:1,

    nextPage(){
        this.page++;
    },

    previusPage(){
        if (this.page > 1) {
            this.page--;
        }
    },

    getPage(){
        this.page;
    },

    resetPages(){
        this.page = 0;
    }
}
const toggleAcordion = () => {
    genresAcordion.classList.toggle("show-acordion");
}

const redirectUser = (animeCard) => {
    const getId = animeCard.querySelector(".anime-id").textContent.trim();
    localStorage.setItem("idSerieActual", getId);
    window.location.href = `../Pages/animeSelected.html`;
};

const drawCards = (results) => {
    const animeCard = document.createElement("DIV");

            animeCard.classList.add("anime-result");

            animeCard.innerHTML = `
                            <div class="anime-id"> ${results.mal_id} </div>
                            <div class="anime-image">
                                <img src="${results.images["webp"].large_image_url}" alt="anime-image">
                            </div>
                            <div class="data-anime-cont">
                                <div class="anime-title-cont">
                                    <span class="anime-title">${results.title}</span>
                                </div>
                                
                                <div class="genres-cont">
                                    <span class="gen">${results.genres[0].name}</span>
                                    <span class="gen">${(results.genres.length > 1) ? results.genres[1].name : ""}</span>
                                </div>

                                <div class="anime-metadata">
                                    <div class="studio-cont">
                                        <span class="studio">Studio: ${results.studios[0].name}</span>
                                    </div>

                                    <div class="source-cont">
                                        <span class="source">Source: ${results.source}</span>
                                    </div>

                                    <div class="demography-cont">
                                        <span class="demography">Demography: ${(results.demographics.length > 0) ? results.demographics[0].name : "---"}</span>
                                    </div>
                                </div>

                                <div class="redirect-button-cont">
                                    <button class="redirect-button">More Info</button>
                                </div>
                            </div>
            `
            animeContainer.appendChild(animeCard);

            const moreButton = animeCard.querySelector(".redirect-button");

            moreButton.addEventListener("click", () => {
                redirectUser(animeCard)
            });
}

const loadGenres = async() => { 
    const url = `https://api.jikan.moe/v4/genres/anime`;
    const genresList = document.getElementById("ul_genres");

    let response = await fetch(url);

    let data = await response.json();

    for (let index = 0; index < data.data.length; index++) {
        const li_gen = document.createElement("LI");
        
        li_gen.classList.add("li_genre");

        li_gen.innerHTML = `${data.data[index].name}`;

        genresList.appendChild(li_gen);

        li_gen.addEventListener("click", () => {
            localStorage.setItem("genreActual", (data.data[index].mal_id));
            localStorage.setItem("serieSearch", "");
            window.location.reload(); 
        })
    }
}
//agregar lo de las paginas
const loadFromInput = async(input) => {
    try {
        const url = `https://api.jikan.moe/v4/anime?q=${input}&limit=20`

        let response = await fetch(url);

        let data = await response.json();

        let results = data.data;
        for (let index = 0; index < results.length; index++) {
            drawCards(results[index]);
    }
    } catch (error) {
        
    }
}

const loadFromGenre = async(genre) => {
    try {
        const url = `https://api.jikan.moe/v4/anime?genres=${genre}&limit=20`

        let response = await fetch(url);

        let data = await response.json();

        let results = data.data;
        for (let index = 0; index < results.length; index++) {
            drawCards(results[index]);
    }

    } catch (error) {
      console.log("La api fallo")  
    }
}

acordionBtn.addEventListener("click", toggleAcordion);

searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }

    if (searchInput.value === "") {
        alert("no se puede dejar vacio")
        return;
    }

    if(searchInput.value.length <= 2){
        alert("ingrese un caracter mayor a 3");
        return;
    }

    localStorage.setItem("serieSearch", searchInput.value);
    localStorage.setItem("genreActual", "");
    window.location.reload();
})

document.addEventListener("DOMContentLoaded", () => {
    loadGenres();

    const functionToLoad = (searchActual !== "" && genreActual === "") ? () => loadFromInput(searchActual) : () => loadFromGenre(genreActual);

    functionToLoad();
});