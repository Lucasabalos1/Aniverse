const genresAcordion = document.querySelector(".inferior-acordion-row");
const acordionBtn = document.querySelector(".superior-acordion-row");
const searchInput = document.querySelector(".search-input");
const animeContainer = document.querySelector(".animes-result-cont");
// optimizar la parte de dibujado de series para no repetir codigo
//Agregar lo de currentPage

const toggleAcordion = () => {
    genresAcordion.classList.toggle("show-acordion");
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

//fixear
const loadFromInput = async(input) => {
    try {
        const url = `https://api.jikan.moe/v4/anime?q=${input}&limit=20`

        let response = await fetch(url);

        let data = await response.json();

        let results = data.data;
        for (let index = 0; index < results.length; index++) {
            const animeCard = document.createElement("DIV");

            animeCard.classList.add("anime-result");

            animeCard.innerHTML = `
                            <div class="anime-image">
                                <img src="${results[index].images["webp"].large_image_url}" alt="anime-image">
                            </div>
                            <div class="data-anime-cont">
                                <div class="anime-title-cont">
                                    <span class="anime-title">${results[index].title}</span>
                                </div>
                                
                                <div class="genres-cont">
                                    <span class="gen">${results[index].genres[0].name}</span>
                                    <span class="gen">${(results[index].genres.length > 1) ? results[index].genres[1].name : ""}</span>
                                </div>

                                <div class="anime-metadata">
                                    <div class="studio-cont">
                                        <span class="studio">Studio: ${results[index].studios[0].name}</span>
                                    </div>

                                    <div class="source-cont">
                                        <span class="source">Source: ${results[index].source}</span>
                                    </div>

                                    <div class="demography-cont">
                                        <span class="demography">Demography: ${(results[index].demographics.length > 0) ? results[index].demographics[0].name : "---"}</span>
                                    </div>
                                </div>

                                <div class="redirect-button-cont">
                                    <button class="redirect-button">More Info</button>
                                </div>
                            </div>
            `
            animeContainer.appendChild(animeCard);

        //Activar el evento para que me lleve a la serie
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
            const animeCard = document.createElement("DIV");

            animeCard.classList.add("anime-result");

            animeCard.innerHTML = `
                            <div class="anime-image">
                                <img src="${results[index].images["webp"].large_image_url}" alt="anime-image">
                            </div>
                            <div class="data-anime-cont">
                                <div class="anime-title-cont">
                                    <span class="anime-title">${results[index].title}</span>
                                </div>
                                
                                <div class="genres-cont">
                                    <span class="gen">${results[index].genres[0].name}</span>
                                    <span class="gen">${(results[index].genres.length > 1) ? results[index].genres[1].name : ""}</span>
                                </div>

                                <div class="anime-metadata">
                                    <div class="studio-cont">
                                        <span class="studio">Studio: ${results[index].studios[0].name}</span>
                                    </div>

                                    <div class="source-cont">
                                        <span class="source">Source: ${results[index].source}</span>
                                    </div>

                                    <div class="demography-cont">
                                        <span class="demography">Demography: ${(results[index].demographics.length > 0) ? results[index].demographics[0].name : "---"}</span>
                                    </div>
                                </div>

                                <div class="redirect-button-cont">
                                    <button class="redirect-button">More Info</button>
                                </div>
                            </div>
            `
            animeContainer.appendChild(animeCard);

        //Activar el evento para que me lleve a la serie
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

    localStorage.setItem("serieSearch", searchInput.value);
    localStorage.setItem("genreActual", "");
    window.location.reload();
})

document.addEventListener("DOMContentLoaded", () => {
    loadGenres();

    const functionToLoad = (searchActual !== "" && genreActual === "") ? () => loadFromInput(searchActual) : () => loadFromGenre(genreActual);

    functionToLoad();
});