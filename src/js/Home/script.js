const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");
const swiperWrapper = document.querySelector(".swiper-wrapper");

const toggleMenu = () =>{
    modal.classList.toggle("visible-modal");
    lateralMenu.classList.toggle("visible-menu");
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


const drawInWelcome = (serie) => {

    let slide = document.createElement("DIV");

    slide.classList.add("swiper-slide");
    
    slide.innerHTML = `
         <img src="${serie.images["webp"].large_image_url}" alt="anime-image">
         <div class="more-info-button-cont">
            <button class="more-info-button"><a href="">More Information</a></button>
         </div>
         <div class="serie-name-cont">
            <span class="serie-name">${serie.title.toUpperCase()}</span>
         </div>
    `
    
    swiperWrapper.appendChild(slide);
}

const inicializeWelcomeSection = async () => {
    
    const welcomeSeries = [41467,813,21,20];

    for (let index = 0; index < welcomeSeries.length; index++) {
        try {
            let response = await fetch(`https://api.jikan.moe/v4/anime/${welcomeSeries[index]}`)
            
            let data =  await response.json();
                        
            drawInWelcome(data.data)
            
        } catch (error) {
            console.log("La api fallo")
        }
    }
    inicializeSwipper();
};

modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
document.addEventListener("DOMContentLoaded", inicializeWelcomeSection)
