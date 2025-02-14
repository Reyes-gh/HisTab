let showLogo = document.querySelector("input#showLogo"),
    formModo = document.querySelectorAll("input[name='modoApp']")
const audioContext = new (window.AudioContext || window.webkitAudioContext()),
    storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;

var arrayBuffer;
var soundMenu;
fetch("sound/riders/menu_move.wav").then(buffer => buffer.arrayBuffer())
    .then((res) => {
        audioContext.decodeAudioData(res).then(buffer => soundMenu = buffer);
    })

function playMenu() {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = .1;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.loop = false
    source.buffer = soundMenu;
    source.start(0)
    source.onended = () => {
        source.stop()
    }
}

//! Configuración predeterminada
storage.sync.get({
    'modoApp': 'Sonic',
    'isLogoActive': true,
    'globalConfig': {
        videoSD: "video/kingdom_low.mp4",
        videoHD: "video/kingdom3.mp4",
    }
}, async function (obj) {

    let modoApp = obj.modoApp;
    let isLogoActive = obj.isLogoActive;

    showLogo.value = showLogo.checked = isLogoActive;

    formModo.forEach((modo) => {
        modo.addEventListener("change", function () {
            storage.sync.set({ ["modoApp"]: this.value })
            playMenu()

            formModo.forEach((modo) => {
                modo.removeAttribute("checked")
                modo.classList.remove("startBlink");
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
                case 'Riders':
                    storage.sync.set({
                        ["globalConfig"]: {
                            videoSD: "video/PLACE_low.mp4",
                            videoHD: "video/PLACE.mp4",
                        }
                    })
                    break;
            }
            modo.setAttribute("checked", true);
            this.classList.add("startBlink")
        })
        modo.removeAttribute("checked");
        if (modo.value == modoApp) modo.setAttribute("checked", true);
    })

    showLogo.addEventListener("change", () => {
        isLogoActive = !isLogoActive;
        storage.sync.set({ ["isLogoActive"]: isLogoActive })
    })
})