const genresAcordion = document.querySelector(".inferior-acordion-row");
const acordionBtn = document.querySelector(".superior-acordion-row")
const searchInput = document.querySelector(".search-input");
const toggleAcordion = () => {
    genresAcordion.classList.toggle("show-acordion")
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
    }
}

acordionBtn.addEventListener("click", toggleAcordion);

searchInput.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") {
        return;
    }

    localStorage.setItem("serieSearch", searchInput.value);
    localStorage.setItem("genreActual", "");
    window.location.reload();
})

const loadFromInput = (input) => {
    console.log(input);
}

const loadFromGenre = (genre) => {
    console.log(genre)
}

document.addEventListener("DOMContentLoaded", () => {
    loadGenres();

    const functionToLoad = (searchActual !== "" && genreActual === "") ? () => loadFromInput(searchActual) : () => loadFromGenre(genreActual);

    functionToLoad();
});