const favoriteContainer = document.querySelector(".info-favorites-cont");
const popularContainer = document.querySelector(".info-popular-cont");
const userList = document.querySelector(".user-list-section");
const popularList = document.querySelector(".popular-list-section");
const currentList = localStorage.getItem("current-list");
const userListBtn = document.getElementById("userListBtn");
const popularListBtn = document.getElementById("popularListBtn");

const currentControler = {
  page:1,
  seriesCounter: 1,

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
  },

  nextSerieCount(){
    this.seriesCounter++;
  },

  previusSerieCount(){
    if (this.seriesCounter > 1) {
      this.seriesCounter--;
    }
  },

  getSerieCount(){
    return this.seriesCounter;
  },

  resetSeriesCounter(){
    this.seriesCounter = 1;
  }
}

const actions = {
    USER: () => {
      popularListBtn.classList.remove("selected-list");
      userListBtn.classList.add("selected-list");
      userListBtn.disabled = true;
      popularListBtn.disabled = false;
    },
    POPULAR: () => {
      userListBtn.classList.remove("selected-list");
      popularListBtn.classList.add("selected-list");
      popularListBtn.disabled = true;
      userListBtn.disabled = false;
    },
  };

const toggleList = (btn) => {
  userList.classList.toggle("hidden-list");
  popularList.classList.toggle("hidden-list");

  const selected = btn.innerHTML.split(" ")[0];
  const action = actions[selected];

  if (action) {
    action();
  }
};

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
                                    <img src="${
                                      series[index].image
                                    }" alt="anime-img">
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
                                <span class="score">${
                                  series[index].score
                                }</span>
                                <span class="edit">Edit</span>
                            </div>
            `;

    favoriteContainer.appendChild(animeContainer);
  }
};

const loadFavoriteSeries = () => {
  let storageData = JSON.parse(localStorage.getItem("seriesPorUsuario"));

  let user = storageData.usuarios.find((u) => u.user_id === userId);

  const userSeries = user.series;

  drawFavoritesSeries(userSeries);
};

const drawPopularSeries = (series) => {
  for (let index = 0; index < series.length; index++) {
    let animeContainer = document.createElement("DIV");

    animeContainer.classList.add("anime-cont");

    animeContainer.innerHTML = `
                            <div class="number-cont">
                                <span>${currentControler.getSerieCount()}</span>
                            </div>

                            <div class="sleeve-cont">
                                <div class="img-cont">
                                    <img src="${
                                      series[index].images["webp"]
                                        .large_image_url
                                    }" alt="anime-img">
                                </div>
                            </div>

                            <div class="anime-title-cont">
                                <span>${series[index].title}</span>
                            </div>

                            <div class="anime-type-cont">
                                <span>${series[index].type}</span>
                            </div>

                            <div class="episodes-cont">
                                <span>${
                                  series[index].episodes != null
                                    ? series[index].episodes
                                    : "?"
                                }</span>
                            </div>

                            <div class="score-cont">
                                <span class="score">${
                                  series[index].score
                                }</span>
                            </div>
            `;
    popularContainer.appendChild(animeContainer);
    currentControler.nextSerieCount();
  }
};

const loadPopularSeries = async (page) => {
  const url = `https://api.jikan.moe/v4/top/anime?page=${page}`;

  let response = await fetch(url);

  let data = await response.json();

  drawPopularSeries(data.data);
};

document.querySelector(".more-animes-btn").addEventListener("click", () => {
  currentControler.nextPage();
  loadPopularSeries(currentControler.getPage());
});

document.addEventListener("DOMContentLoaded", loadFavoriteSeries);
document.addEventListener("DOMContentLoaded", () => {
  loadPopularSeries(currentControler.getPage());
});
document.addEventListener("DOMContentLoaded", () => {
  
  const inicializeList = {
    usuario: () => {
        userListBtn.classList.add("selected-list");
        popularList.classList.add("hidden-list");
        userListBtn.disabled = true;
    },
    popular: () => {
        popularListBtn.classList.add("selected-list");
        popularList.classList.remove("hidden-list")
        userList.classList.add("hidden-list");
        popularListBtn.disabled = true;
    }
  }
  
  const action = inicializeList[currentList];
  action();
});

userListBtn.addEventListener("click", () => toggleList(userListBtn));
popularListBtn.addEventListener("click", () => toggleList(popularListBtn));
