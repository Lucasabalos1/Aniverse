const favoriteContainer = document.querySelector(".info-favorites-cont");
const popularContainer = document.querySelector(".info-popular-cont");
const userList = document.querySelector(".user-list-section");
const popularList = document.querySelector(".popular-list-section");
const currentList = localStorage.getItem("lista-actual");
const userListBtn = document.getElementById("userListBtn")
const popularListBtn = document.getElementById("popularListBtn")

let currentPage = 1;
let seriesCounter = 1;
//Mejorar esto ultimo a futuro


const toggleList = (btn) => {
    userList.classList.toggle("hidden-list");
    popularList.classList.toggle("hidden-list");

    //mejorar
    if (btn === userListBtn) {
        popularListBtn.classList.remove("selected-list")
        userListBtn.classList.add("selected-list")
        userListBtn.disabled = true;
        popularListBtn.disabled = false;
    }else if (btn === popularListBtn) {
        userListBtn.classList.remove("selected-list")
        popularListBtn.classList.add("selected-list")
        popularListBtn.disabled = true;
        userListBtn.disabled = false;
    }
}

const drawFavoritesSeries = (series) => {
    for (let index = 0; index < series.length; index++) {
        let animeContainer = document.createElement("DIV");

        animeContainer.classList.add("anime-cont");

        animeContainer.innerHTML = `
                        <div class="number-cont">
                            <span>${index + 1}</span>
                        </div>

                        <div class="sleeve-cont">
                            <div class="img-cont">
                                <img src="${series[index].image}" alt="anime-img">
                            </div>
                        </div>

                        <div class="anime-title-cont">
                            <span>${series[index].name}</span>
                        </div>

                        <div class="anime-type-cont">
                            <span>${series[index].type}</span>
                        </div>

                        <div class="episodes-cont">
                            <span>${series[index].episodes}</span>
                        </div>

                        <div class="score-cont">
                            <span class="score">${series[index].score}</span>
                            <span class="edit">Edit</span>
                        </div>
        `

        favoriteContainer.appendChild(animeContainer);
    }
}

const loadFavoriteSeries = () => {
    let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario"));

    let user = storageData.usuarios.find(u => u.user_id === userId);

    const userSeries = user.series;

    drawFavoritesSeries(userSeries);
}

const drawPopularSeries = (series) =>{
    for (let index = 0; index < series.length; index++) {
        let animeContainer = document.createElement("DIV");

        animeContainer.classList.add("anime-cont");

        animeContainer.innerHTML = `
                        <div class="number-cont">
                            <span>${seriesCounter}</span>
                        </div>

                        <div class="sleeve-cont">
                            <div class="img-cont">
                                <img src="${series[index].images["webp"].large_image_url}" alt="anime-img">
                            </div>
                        </div>

                        <div class="anime-title-cont">
                            <span>${series[index].title}</span>
                        </div>

                        <div class="anime-type-cont">
                            <span>${series[index].type}</span>
                        </div>

                        <div class="episodes-cont">
                            <span>${(series[index].episodes != null) ? series[index].episodes : "?"}</span>
                        </div>

                        <div class="score-cont">
                            <span class="score">${series[index].score}</span>
                        </div>
        `
        popularContainer.appendChild(animeContainer);
        seriesCounter++;
    }
}

const loadPopularSeries = async(page) =>{
    const url = `https://api.jikan.moe/v4/top/anime?page=${page}`

    let response = await fetch(url);

    let data = await response.json();

    drawPopularSeries(data.data);
}

document.querySelector(".more-animes-btn").addEventListener("click", () => {
    currentPage++;
    loadPopularSeries(currentPage)
});

document.addEventListener("DOMContentLoaded", loadFavoriteSeries)
document.addEventListener("DOMContentLoaded", () => { loadPopularSeries(currentPage)})
document.addEventListener("DOMContentLoaded", () => {
    //mejorar
    if (currentList === "usuario") {
        userListBtn.classList.add("selected-list");
        popularList.classList.add("hidden-list");
        userListBtn.disabled = true;
    } else if (currentList === "popular") {
        popularListBtn.classList.add("selected-list");
        userList.classList.add("hidden-list");
        popularListBtn.disabled = true;
    }
});

userListBtn.addEventListener("click", () => toggleList(userListBtn));
popularListBtn.addEventListener("click", () => toggleList(popularListBtn));
