let modoShadow;
const storage = (typeof browser !== "undefined" && browser.storage) ? browser.storage : chrome.storage;
storage.sync.get('modoShadow', async function (obj) {
    modoShadow = obj.modoShadow;

    let scriptJQuery = document.createElement('script');
    scriptJQuery.src = '../js/jquery3.7.1.js';
    document.head.appendChild(scriptJQuery);

    Promise.all([
        whichFunc(modoShadow)
    ])

})

async function fetchHTMLAsText(url) {
    return await (await fetch(url)).text()
}

function whichFunc(isItShadow) {
    if (isItShadow) toShadow()
    else toSonic()
}

async function toShadow() {

    document.body.innerHTML = '<div class="cortina"></div>';
    document.head.innerHTML += '<link rel="stylesheet" href="css/indexShadow.css">';
    document.body.innerHTML += await fetchHTMLAsText("../templates/shadow.html")

    let scriptAudioShadow = document.createElement('script');
    scriptAudioShadow.src = '../js/audioShadow.js';
    document.head.appendChild(scriptAudioShadow);
    let scriptIndex = document.createElement('script');
    let scriptClock = document.createElement('script');
    scriptIndex.src = '../js/index.js';
    scriptClock.src = '../js/clock.js';
    document.head.appendChild(scriptClock);
    document.head.appendChild(scriptIndex);
}

async function toSonic() {
    document.body.innerHTML = '<div class="cortina"></div>';
    document.head.innerHTML += '<link rel="stylesheet" href="css/indexSonic.css">';
    document.body.innerHTML += await fetchHTMLAsText("../templates/sonic.html")

    let scriptAudioSonic = document.createElement('script');
    scriptAudioSonic.src = '../js/audioSonic.js';
    document.head.appendChild(scriptAudioSonic);
    let scriptIndex = document.createElement('script');
    let scriptClock = document.createElement('script');
    scriptIndex.src = '../js/index.js';
    scriptClock.src = '../js/clock.js';
    document.head.appendChild(scriptClock);
    document.head.appendChild(scriptIndex);
}
