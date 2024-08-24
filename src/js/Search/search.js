const genresAcordion = document.querySelector(".inferior-acordion-row");
const acordionBtn = document.querySelector(".superior-acordion-row")

const toggleAcordion = () => {
    genresAcordion.classList.toggle("show-acordion")
}


acordionBtn.addEventListener("click", toggleAcordion)