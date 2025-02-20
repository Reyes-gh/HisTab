let imagenesRow = document.querySelectorAll(".textoLetra"),
    gravityDiveContainer = document.querySelector(".gravityDiveContainer"),
    cogSettings = document.querySelector(".cogSettings");
const containerO = document.querySelector(".containerLetraO"),
    rootCSS = document.querySelector(':root').style,
    menuA = document.querySelector(".menuA"),
    colorRiders = document.querySelector("#colorRiders"),
    cancelColor = document.querySelector(".cancelColor")

setTimeout(() => {
    imagenesRow.forEach((imagen) => {
        imagen.classList.add("withTransition");
    })
    document.querySelector(".menuB").classList.add("withTransition")
    /* document.querySelector(".sonic").classList.add("withTransition") */
}, 1);

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
            buscadorClone.blur();
        };
    }
})

/* storage.sync.get({ ridersColor: { red: 0, green: 0, blue: 0, alpha: 0 } }, ({ ridersColor }) => {
    cambiaColor(ridersColor)
    colorRiders.value = rgbToHex(ridersColor.red, ridersColor.green, ridersColor.blue)
}) */

storage.sync.get({ "ridersTurn": "0" }, ({ ridersTurn: grados }) => {
    cambiaColor(grados, true)
    colorRiders.value = grados;
})

var timeoutColor = setTimeout(() => { });

/* colorRiders.addEventListener("input", ({ target: { value: color } }) => {
    if (timeoutColor != undefined) clearTimeout(timeoutColor);
    cambiaColor(hexToRgb(color))
    timeoutColor = setTimeout(() => {
        cambiaColor(hexToRgb(color), true)
    }, 1500);
}) */

colorRiders.addEventListener("input", ({ target: { value: grados } }) => {
    if (timeoutColor != undefined) clearTimeout(timeoutColor);
    cambiaColor(grados)
    timeoutColor = setTimeout(() => {
        cambiaColor(grados, true)
    }, 600);
})

var disableSave = true

/* cancelColor.addEventListener("click", () => {
    if (disableSave) {
        clearInterval(timeoutColor)
        cambiaColor({
            red: 0,
            green: 0,
            blue: 0,
            alpha: 0,
        }, true)
        disableSave = false
        setTimeout(() => {
            disableSave = true
        }, 2500);
        reproduceSonido(menuQuestion, .5)
    }
}) */

var extrasMusic;

cogSettings.addEventListener("click", () => {
    menuA.classList.toggle("gearChange")
    cogSettings.classList.toggle("gearSpin")
    if (menuA.classList.contains("gearChange")) {
        if (extrasMusic == undefined) extrasMusic = reproduceSonidoVisual(menuExtras, .2, true, 18, 87.6, 0, 500);
        else setTimeout(() => {
            turnUp(extrasMusic, 0.15)
        }, 250);
    }
    else {
        lowerVolume(extrasMusic, 0.004)
    }
    reproduceSonido(menuConfirm, 0.2)
})

/* async function cambiaColor({ red, green, blue, alpha }, save = false) {
    $(".colorMask").css({
        "background-color": `rgb(${red}, ${green}, ${blue}, ${alpha})`
    })
    if (red == 0 && green == 0 && blue == 0 && alpha == 0) $(".variableHue").addClass("original");
    else $(".variableHue").removeClass("original");
    if (save) storage.sync.set({ ["ridersColor"]: { red: red, green: green, blue: blue, alpha: alpha } })
} */

async function cambiaColor(grados, save = false) {
    document.documentElement.style.setProperty('--default-color', grados + "deg");
    if (save) {
        storage.sync.set({ ridersTurn: grados })
        console.log("saved");
    }
}

function generaDive() {
    if (gravityDiveContainer.children.length > 0) return false;
    const gravityDot = { classList: clases } = document.createElement("div");
    clases.add("gravityDot");
    gravityDiveContainer.appendChild(gravityDot)

    gravityDot.addEventListener("animationend", () => {
        gravityDot.remove()
    }, false);

    chrome.runtime.sendMessage({ action: "backgroundCall", params: [source = 'sound/riders/gravityDive.ogg', volume = .15] }, (response) => {
        console.log("Respuesta del background:", response);
    });

    return true;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');

    // Convertir los valores hexadecimales a enteros
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    return { red: r, green: g, blue: b, alpha: 1 }
}

function rgbToHex(r, g, b) {
    // Asegurarse de que cada componente esté en el rango de 0 a 255
    r = Math.min(255, Math.max(0, r));
    g = Math.min(255, Math.max(0, g));
    b = Math.min(255, Math.max(0, b));

    // Convertir cada componente a su valor hexadecimal y agregar los ceros si es necesario
    return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
}
