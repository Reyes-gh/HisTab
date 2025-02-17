let imagenesRow = document.querySelectorAll(".textoLetra")
let gravityDiveContainer = document.querySelector(".gravityDiveContainer");
const containerO = document.querySelector(".containerLetraO");

setTimeout(() => {
    imagenesRow.forEach((imagen) => {
        imagen.classList.add("withTransition");
    })
}, 1);

if (containerO) {
    containerO.addEventListener("click", () => {
        generaDive();
    })
}

//! Replace del buscador para quitar el listener genérico y poner el custom
buscadorClone = buscador.cloneNode(true);
buscador.parentNode.replaceChild(buscadorClone, buscador);

buscadorClone.addEventListener("keydown", function ({ value: valorBusqueda, key: tecla } = e) {
    if (tecla == "Enter") {
        generaDive();
        console.log(valorBusqueda);
        if (valorBusqueda != "" && valorBusqueda != undefined) {
            setTimeout(() => {
                window.location = `https://www.google.com/search?q=${valorBusqueda}`
            }, 5000)
        }
    }
})

function generaDive() {
    if (gravityDiveContainer.children.length > 0) return;
    const gravityDot = { classList: clases } = document.createElement("div");
    clases.add("gravityDot");
    gravityDiveContainer.appendChild(gravityDot)

    turnOff(reproduceSonido(soundPressStart, .5), 26);
    setTimeout(() => {
        gravityDot.remove();
    }, 3000);
}

setInterval(() => {
    lineaFondoFade(Math.floor(Math.random() * 6) + 1)
}, 1000);
