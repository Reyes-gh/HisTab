let modoShadow,
    isLogoActive,
    showModo = document.querySelector("#showModo"),
    showLogo = document.querySelector("input#showLogo"),
    contenedorImagen = document.querySelector(".containerButton"),
    imagen = document.createElement("img")
const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;

imagen.classList.add("imagenPopup")

storage.sync.get({ 'modoShadow': false }, function (obj) {
    modoShadow = obj.modoShadow;
    cambiaFoto();
})

storage.sync.get({ 'isLogoActive': true }, function (obj) {
    isLogoActive = obj.isLogoActive;
    showLogo.value = showLogo.checked = isLogoActive;
})

contenedorImagen.addEventListener("click", () => {
    modoShadow = !modoShadow;
    storage.sync.set({ ["modoShadow"]: modoShadow })
    cambiaFoto()
    window.dispatchEvent(new HashChangeEvent("hashchange"))
})

showLogo.addEventListener("change", () => {
    isLogoActive = !isLogoActive;
    console.log(isLogoActive);
    storage.sync.set({ ["isLogoActive"]: isLogoActive })
    console.log(storage, storage.sync)
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