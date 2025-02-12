var modoShadow;
var showLogo;

document.addEventListener("DOMContentLoaded", () => {
    const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;
    storage.sync.get(["modoShadow", "isLogoActive"], async function (obj) {
        modoShadow = obj.modoShadow;
        showLogo = obj.isLogoActive;
        let pageHTML = (modoShadow ? ("Shadow") : ("Sonic"));

        function loadPage(pageHTML) {
            fetch(`templates/${pageHTML}.html`)
                .then(fetchedHTML => fetchedHTML.text())
                .then(html => {
                    document.getElementById("appSonic").innerHTML = html

                    if (!showLogo) document.querySelector(`.texto${pageHTML}Row`).remove();

                    let scriptAudio = document.createElement('script');
                    scriptAudio.src = `js/audio${pageHTML}.js`;
                    document.head.appendChild(scriptAudio);
                    let scriptIndex = document.createElement('script');
                    let scriptClock = document.createElement('script');
                    scriptIndex.src = 'js/index.js';
                    scriptClock.src = 'js/clock.js';
                    document.head.appendChild(scriptClock);
                    document.head.appendChild(scriptIndex);

                })
                .catch(error => console.error("Error cargando la página:", error));
        }

        function router() {
            const route = pageHTML; // Si no hay hash, va a home
            loadPage(route);
        }

        window.addEventListener("hashchange", router);
        router(); // Cargar la primera vez
    })

})

