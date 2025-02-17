let imagenesRow = document.querySelectorAll(".textoLetra")
let gravityDiveContainer = document.querySelector(".gravityDiveContainer");
const containerO = document.querySelector(".containerLetraO");

setTimeout(() => {
    imagenesRow.forEach((imagen) => {
        imagen.classList.add("withTransition");
    })
}, 1);

if (containerO) {
    /* containerO.addEventListener("click", () => {
        generaDive();
    }) */
}

//! Replace del buscador para quitar el listener genérico y poner el custom
buscadorClone = buscador.cloneNode(true);
buscador.parentNode.replaceChild(buscadorClone, buscador);

buscadorClone.addEventListener("keydown", function ({ target: { value: valorBusqueda }, key: tecla } = e) {
    if (tecla == "Enter") {
        if (generaDive()) {
            if (valorBusqueda != "" && valorBusqueda != undefined) {
                setTimeout(() => {
                    window.location = `https://www.google.com/search?q=${valorBusqueda}`
                }, 1000)
            }
        };
    }
})

function generaDive() {
    if (gravityDiveContainer.children.length > 0) return false;
    const gravityDot = { classList: clases } = document.createElement("div");
    clases.add("gravityDot");
    gravityDiveContainer.appendChild(gravityDot)

    gravityDot.addEventListener("animationend", () => {
        gravityDot.remove()
    }, false);

    chrome.runtime.sendMessage({ action: "back", params: [source = 'sound/riders/gravityDive.ogg', volume = .15] }, (response) => {
        console.log("Respuesta del background:", response);
    });

    return true;
}

/* let linea = document.querySelector(".backgroundLine");
setInterval(() => {
    if (linea.style.opacity < 1000) {
        linea.style.opacity += 100;
    } else {

    }
}, 1000); */


