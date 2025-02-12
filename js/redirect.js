var modoApp;
var showLogo;
var globalConfig;
const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;

document.addEventListener("DOMContentLoaded", () => {
    storage.sync.get(["modoApp", "isLogoActive"], async function (obj) {
        modoApp = obj.modoApp;
        showLogo = obj.isLogoActive;

        function loadPage(pageHTML) {
            fetch(`templates/${pageHTML}.html`)
                .then(fetchedHTML => fetchedHTML.text())
                .then(async html => {
                    document.getElementById("appSonic").innerHTML = html

                    if (!showLogo) document.querySelector(`.texto${pageHTML}Row`).remove();

                    let scriptAudio = document.createElement("script");
                    let scriptVideo = document.createElement("script");
                    let scriptClock = document.createElement("script");
                    let scriptIndex = document.createElement("script");

                    scriptAudio.src = `js/${modoApp}/audio.js`;
                    scriptVideo.src = `js/video.js`;
                    scriptClock.src = 'js/clock.js';
                    scriptIndex.src = 'js/index.js';

                    Promise.all([
                        document.head.appendChild(scriptAudio),
                        document.head.appendChild(scriptVideo),
                        document.head.appendChild(scriptClock),
                    ]).then(async () => {
                        await Promise.resolve(document.head.appendChild(scriptIndex))
                        console.log("All scripts loaded!")
                    })

                })
                .catch(error => console.error("Error cargando la página:", error));
        }

        async function router() {
            await loadPage(modoApp);
        }

        window.addEventListener("hashchange", router);
        router(); // Cargar la primera vez
    })

})

