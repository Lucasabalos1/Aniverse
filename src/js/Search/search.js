const genresAcordion = document.querySelector(".inferior-acordion-row");
const acordionBtn = document.querySelector(".superior-acordion-row");
const searchInput = document.querySelector(".search-input");
const animeContainer = document.querySelector(".animes-result-cont");
const prevBtn = document.querySelector(".prev_button");
const nextBtn = document.querySelector(".next_button");

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
        return this.page;
    },

    resetPages(){
        this.page = 1;
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
                                <img src="${results.images["webp"].large_image_url}" alt="anime-image" loading="lazy">
                            </div>
                            <div class="data-anime-cont">
                                <div class="anime-title-cont">
                                    <span class="anime-title">${results.title}</span>
                                </div>
                                
                                <div class="genres-cont">
                                    <span class="gen">${(results.genres.length > 0) ? results.genres[0].name: "?"}</span>
                                    <span class="gen">${(results.genres.length > 1) ? results.genres[1].name : "?"}</span>
                                </div>

                                <div class="anime-metadata">
                                    <div class="studio-cont">
                                        <span class="studio">Studio: ${(results.studios.length > 0) ? results.studios[0].name : "?"}</span>
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
    try {
        const url = `https://api.jikan.moe/v4/genres/anime`;
        const genresList = document.getElementById("ul_genres");
    
        const results = await callForApi(url);
    
        for (let index = 0; index < results.length; index++) {
            const li_gen = document.createElement("LI");
            
            li_gen.classList.add("li_genre");
    
            li_gen.innerHTML = `${results[index].name}`;
    
            genresList.appendChild(li_gen);
    
            li_gen.addEventListener("click", () => {
                localStorage.setItem("genreActual", (results[index].mal_id));
                localStorage.setItem("serieSearch", "");
                window.location.reload(); 
            })
        }
    } catch (error) {
        console.log(`API call failed: ${error.message}`)
    }
}

const loadFromInput = async(input, page) => {
    try {
        const url = `https://api.jikan.moe/v4/anime?q=${input}&limit=20&page=${page}`

        let response = await fetch(url);

        let data = await response.json();

        let results = data.data;
        for (let index = 0; index < results.length; index++) {
            drawCards(results[index]);
        }

        if (!data.pagination.has_next_page) {
            nextBtn.setAttribute("disabled", "true")
        }else{
            nextBtn.removeAttribute("disabled")
        }
        
    } catch (error) {
        console.log(`API call failed: ${error.message}`)

    }
}

const loadFromGenre = async(genre, page) => {
    try {
        const url = `https://api.jikan.moe/v4/anime?genres=${genre}&limit=20&page=${page}`

        let response = await fetch(url);

        let data = await response.json();

        let results = data.data;
        
        for (let index = 0; index < results.length; index++) {
            drawCards(results[index]);
        }

        if (!data.pagination.has_next_page) {
            nextBtn.setAttribute("disabled", "true")
        }else{
            nextBtn.removeAttribute("disabled")
        }

    } catch (error) {
      console.log("La api fallo")
      console.log(error)
    }
}

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

nextBtn.addEventListener("click", () => {
    currentPage.nextPage();

    acordionBtn.scrollIntoView({behavior: "smooth"});

    const functionToLoad = (searchActual !== "" && genreActual === "") ? () => loadFromInput(searchActual, currentPage.getPage()) : () => loadFromGenre(genreActual,currentPage.getPage());

    animeContainer.innerHTML= ""

    functionToLoad();

    if (currentPage.getPage() > 1 && prevBtn.hasAttribute("disabled")) {
        prevBtn.removeAttribute("disabled")
    }
});

prevBtn.addEventListener("click", () => {
    currentPage.previusPage();

    acordionBtn.scrollIntoView({behavior: "smooth"});

    const functionToLoad = (searchActual !== "" && genreActual === "") ? () => loadFromInput(searchActual, currentPage.getPage()) : () => loadFromGenre(genreActual,currentPage.getPage());

    animeContainer.innerHTML= ""

    functionToLoad();

    if (currentPage.getPage() === 1) {
        prevBtn.setAttribute("disabled", "true");
    }

});

acordionBtn.addEventListener("click", toggleAcordion);

document.addEventListener("DOMContentLoaded", async() => {
    loadGenres();

    const functionToLoad = (searchActual !== "" && genreActual === "") ? () => loadFromInput(searchActual, 1) : () => loadFromGenre(genreActual,1);

    functionToLoad();

    if (currentPage.getPage() === 1) {
        prevBtn.setAttribute("disabled", "true");
    }

    document.querySelector(".message").innerHTML = (searchActual != "") ? `RESULTS FOR ${searchActual}` : (genreActual != "" && searchActual === "" ) ? `RESULTS FOR ${await getGenreName(genreActual)}` : ""; 
});