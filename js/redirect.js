var modoApp,
    showLogo;
const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;

document.addEventListener("DOMContentLoaded", () => {

    //! Configuración predeterminada
    storage.sync.get({
        'modoApp': 'Sonic',
        'isLogoActive': true,
    }, async function (obj) {
        modoApp = obj.modoApp;
        showLogo = obj.isLogoActive;
        function loadPage(pageHTML) {

            fetch(`templates/${pageHTML.toLowerCase()}.html`)
                .then(fetchedHTML => fetchedHTML.text())
                .then(async html => {
                    document.getElementById("appSonic").innerHTML = html

                    if (!showLogo) document.querySelector(`.containerTexto`).remove();

                    let scriptAudio = document.createElement("script");
                    let scriptVideo = document.createElement("script");
                    let scriptClock = document.createElement("script");
                    let scriptIndex = document.createElement("script");

                    let scriptOwnController = document.createElement("script");

                    const lowerModo = modoApp.toLowerCase()

                    scriptAudio.src = `js/${lowerModo}/audio.js`;
                    scriptVideo.src = `js/video.js`;
                    scriptClock.src = 'js/clock.js';
                    scriptIndex.src = 'js/index.js';

                    scriptOwnController.src = `js/${lowerModo}/controller.js`;

                    await Promise.all([
                        new Promise(resolve => { scriptAudio.onload = resolve; document.head.appendChild(scriptAudio); }),
                        new Promise(resolve => { scriptVideo.onload = resolve; document.head.appendChild(scriptVideo); }),
                        new Promise(resolve => { scriptClock.onload = resolve; document.head.appendChild(scriptClock); }),
                        new Promise(resolve => { scriptIndex.onload = resolve; document.head.appendChild(scriptIndex); }),
                    ]).then(async () => {
                        await new Promise(resolve => { scriptOwnController.onload = resolve; document.head.appendChild(scriptOwnController); });
                        console.log("All scripts loaded!");
                        $(".cortina").fadeOut("", () => {
                            console.log($(".cortina").remove())
                        })

                    }).catch(() => {
                        console.log("Something failed while loading scripts!");
                    })

                })
                .catch(error => console.error("Error cargando la página:", error));
        }

        async function router() {
            await loadPage(modoApp);
        }

        router(); // Cargar la primera vez
    })

})