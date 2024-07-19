const modal = document.querySelector(".modal-menu-container");
const lateralMenu = document.querySelector(".menu-lateral-container");
const modalBtn = document.querySelector(".modal-button");
const closeBtn = document.getElementById("close-modal-button");

const toggleMenu = () =>{
    modal.classList.toggle("visible-modal");
    lateralMenu.classList.toggle("visible-menu");
}

modalBtn.addEventListener("click", toggleMenu);
closeBtn.addEventListener("click", toggleMenu);
