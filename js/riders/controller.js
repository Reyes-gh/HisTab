let imagenesRow = document.querySelectorAll(".textoLetra")

setTimeout(() => {
    imagenesRow.forEach((imagen) => {
        imagen.classList.add("withTransition");
    })
}, 1);