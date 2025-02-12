let letraO = document.querySelector(".letraO"),
    buscador = document.querySelector("#searchBarInput"),
    buscadorContainer = document.querySelector(".searchBarContainer"),
    videoContainer = document.querySelector("#backgroundVideo")

function busqueda(valorBusqueda) {
    buscador.classList.add("noEvents");
    reproduceSonido(soundPressStart);

    setInterval(() => {
        $(".searchBarContainer").fadeToggle(0)
    }, 100);

    setTimeout(() => {
        window.location = `https://www.google.com/search?q=${valorBusqueda}`
    }, 3000)
}

buscador.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        busqueda(this.value)
    }
})

setTimeout(() => {
    buscadorContainer.classList.add("withTransition");
}, 500);

let videoSource;
let isHDAvailable;
videoSource = document.createElement("source");
videoSource.src = "video/kingdom_low.mp4"

fetch("video/kingdom3.mp4",
    { method: "HEAD" }
).then((res) => {
    isHDAvailable = res.ok
    if (window.innerWidth > 768 && isHDAvailable) videoSource.src = "video/kingdom3.mp4"
    videoContainer.appendChild(videoSource)
})


