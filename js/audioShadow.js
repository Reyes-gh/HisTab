const audioContext = new (window.AudioContext || window.webkitAudioContext());
let shadowRowText = document.querySelector(".textoShadowRow"),
    backgroundVideo = document.querySelector("#backgroundVideo"),
    conteoRing = 0,
    timeoutRings,
    timeoutTransition

Promise.all([
    cargaSonido("../sound/ring.wav").then(buffer => soundRing = buffer),
    cargaSonido("../sound/shadow/shadowCalmNo.wav").then(buffer => soundShadowNo = buffer),
    cargaSonido("../sound/shadow/shadowYes.wav").then(buffer => soundShadowYes = buffer),
    cargaSonido("../sound/shadow/shadowWitnessPower.wav").then(buffer => soundShadowWitnessPower = buffer),
    cargaSonido("../sound/shadow/shadowChaosSpear.mp3").then(buffer => soundShadowChaosSpear = buffer),
    cargaSonido("../sound/shadow/shadowIAmTheUltimate.wav").then(buffer => soundShadowIAmTheUltimate = buffer),
    cargaSonido("../sound/shadow/shadowBeholdUltimatePower.mp3").then(buffer => shadowBeholdUltimatePower = buffer),
    cargaSonido("../sound/shadow/press_start.wav").then(buffer => soundPressStart = buffer),
]).then(() => {
    console.log("Come on! Step it up!");
});

$(".textoLetra").on("mousedown", function () {
    // RING SOUND
    if ($(this).hasClass("letraO")) {
        reproduceSonido(soundRing)
        clearTimeout(timeoutRings)
        conteoRing += 1;

        let newRingTag = document.createElement("img")
        let textoRing = document.createElement("div");

        newRingTag.setAttribute("src", "images/sonic/ring.gif")
        newRingTag.style.left = Math.random(100) * 100 + "%";
        newRingTag.classList.add("ringClass");

        $(".ringList").append(newRingTag);

        textoRing.style.top = letraO.getBoundingClientRect().y
        textoRing.style.left = letraO.getBoundingClientRect().x + 25 + "px"

        textoRing.textContent = conteoRing
        textoRing.classList.add("ringCounter")

        $(".ringList").append(textoRing);

        setTimeout(() => {
            newRingTag.remove();
            textoRing.remove();
        }, 4000);

        if (conteoRing > 20) {
            timeoutRings = setTimeout(() => {
                conteoRing = 0;
                reproduceSonido(soundShadowNo)
            }, 500);
        }
        switch (conteoRing) {
            case 25:
                reproduceSonido(soundShadowYes);
                break;
            case 50:
                reproduceSonido(soundShadowWitnessPower);
                break;
            case 75:
                reproduceSonido(soundShadowChaosSpear, .05)
                break;
            case 100:
                reproduceSonido(soundShadowIAmTheUltimate, .03)
                break
            case 125:
                reproduceSonido(shadowBeholdUltimatePower, .05)
                break;
            default:
                break;
        }
    }
})

async function cargaSonido(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function reproduceSonido(nameVar, customVol = .05) {
    if (!nameVar) return;

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    source.buffer = nameVar;
    gainNode.gain.value = customVol;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(0);
}