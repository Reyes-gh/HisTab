let showLogo = document.querySelector("input#showLogo"),
    formModo = document.querySelectorAll("input[name='modoApp']")

const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;

//! Configuración predeterminada
storage.sync.get({
    'modoApp': 'Sonic',
    'isLogoActive': true,
    'globalConfig': {
        lowQualityVideo: "video/kingdom_low.mp4",
        highQualityVideo: "video/kingdom3.mp4",
    }
}, async function (obj) {

    let modoApp = obj.modoApp;
    let isLogoActive = obj.isLogoActive;

    showLogo.value = showLogo.checked = isLogoActive;

    formModo.forEach((modo) => {
        modo.addEventListener("change", function () {
            storage.sync.set({ ["modoApp"]: this.value })

            formModo.forEach((modo) => {
                modo.removeAttribute("checked")
            })

            switch (this.value) {
                case 'Sonic':
                    storage.sync.set({
                        ["globalConfig"]: {
                            videoSD: "video/kingdom_low.mp4",
                            videoHD: "video/kingdom3.mp4",
                        }
                    })
                    break;
                case 'Shadow':
                    storage.sync.set({
                        ["globalConfig"]: {
                            videoSD: "video/radicalhighway_low.mp4",
                            videoHD: "video/radicalhighway.mp4",
                        }
                    })
                    break;
                case 'RidersZG':
                    storage.sync.set({
                        ["globalConfig"]: {
                            videoSD: "video/PLACE_low.mp4",
                            videoHD: "video/PLACE.mp4",
                        }
                    })
                    break;
            }
            modo.setAttribute("checked", true);
        })
        modo.removeAttribute("checked");
        if (modo.value == modoApp) modo.setAttribute("checked", true);
    })

    showLogo.addEventListener("change", () => {
        isLogoActive = !isLogoActive;
        storage.sync.set({ ["isLogoActive"]: isLogoActive })
    })
})


