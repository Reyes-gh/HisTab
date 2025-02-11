let letraO = document.querySelector(".letraO"),
    buscador = document.querySelector("#searchBarInput"),
    buscadorContainer = document.querySelector(".searchBarContainer")

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


