const modal = document.getElementById("modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");

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
    });
}




modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
document.addEventListener("DOMContentLoaded", inicializeSwipper)