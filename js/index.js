let letraO = document.querySelector(".letraO"),
    buscador = document.querySelector("#searchBarInput"),
    buscadorContainer = document.querySelector(".searchBarContainer");

async function busqueda(valorBusqueda) {

    await storage.sync.get('globalConfig', ({ globalConfig: { soundStart: urlStart } }) => {
        chrome.runtime.sendMessage({ action: "backgroundCall", params: [urlStart, volume = .15] }, (response) => {
            console.log("Respuesta del background:", response);
        });
    })

    if (valorBusqueda != "") {
        buscador.classList.add("noEvents");
        setInterval(() => {
            $(".searchBarContainer").fadeToggle(0)
        }, 100);

        setTimeout(() => {
            window.location = `https://www.google.com/search?q=${valorBusqueda}`
        }, 1000)
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

