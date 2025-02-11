let modoShadow,
    showModo = document.querySelector("#showModo"),
    contenedorImagen = document.querySelector(".containerButton"),
    imagen = document.createElement("img")
const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;

imagen.classList.add("imagenPopup")
storage.sync.get('modoShadow', function (obj) {
    modoShadow = obj.modoShadow;
    cambiaFoto();
})

contenedorImagen.addEventListener("click", () => {
    modoShadow = !modoShadow;
    storage.sync.set({
        modoShadow: modoShadow
    })
    cambiaFoto()
    window.dispatchEvent(new HashChangeEvent("hashchange"))
})

function cambiaFoto() {
    contenedorImagen.innerHTML = "";
    switch (modoShadow) {
        case true:
            imagen.setAttribute("src", "../images/shadow/shadow_logo.png")
            break;
        default:
            imagen.setAttribute("src", "../images/sonic/sonic_logo.png")
            break;
    }
    contenedorImagen.append(imagen);
}