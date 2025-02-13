let letraO = document.querySelector(".letraO"),
    buscador = document.querySelector("#searchBarInput"),
    buscadorContainer = document.querySelector(".searchBarContainer");

function busqueda(valorBusqueda) {
    reproduceSonido(soundPressStart);

    if (valorBusqueda != "") {
        buscador.classList.add("noEvents");
        setInterval(() => {
            $(".searchBarContainer").fadeToggle(0)
        }, 100);

        setTimeout(() => {
            window.location = `https://www.google.com/search?q=${valorBusqueda}`
        }, 3000)
    } else {
        buscador.blur()
    }
}

buscador.addEventListener("keydown", function (e) {
    if (e.key == "Enter") {
        busqueda(this.value)
    }
})

setTimeout(() => {
    buscadorContainer.classList.add("withTransition");
}, 500);

