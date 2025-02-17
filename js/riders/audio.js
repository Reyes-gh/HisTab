let sonicRowText = document.querySelector(".textoSonicRow"),
    backgroundVideo = document.querySelector("#backgroundVideo"),
    contenedorRango = document.querySelector(".rankContainer"),
    conteoRing = 0,
    timeoutRings,
    timeoutTransition,
    currentGlobal = undefined,
    currentAppear = undefined,
    currentHisWorldInstrumental = undefined,
    currentHisWorld = undefined,
    timerActive = false,
    timerTime = 0,
    finalTime,
    finalRing = 0,
    bufferResults = undefined;

const audioContext = new (window.AudioContext || window.webkitAudioContext());

if (showLogo) {

    Promise.all([
        cargaSonido("sound/riders/extras.ogg").then(buffer => menuExtras = buffer),
        cargaSonido("sound/ring.wav").then(buffer => soundRing = buffer),
        cargaSonido("sound/riders/menu_confirm.wav").then(buffer => menuConfirm = buffer),
        cargaSonido("sound/riders/menu_question.wav").then(buffer => menuQuestion = buffer),
    ]).then(() => {
        console.log("READY... GO!");
    });

    $(document).on("mousedown", ".textoRidersRow>div:has(.letraO)", function () {

        reproduceSonido(soundRing)

        let newRingTag = document.createElement("img")
        let textoRing = document.createElement("div");
        newRingTag.setAttribute("src", "images/ring.gif")
        newRingTag.style.left = Math.random(100) * 100 + "%";
        newRingTag.classList.add("ringClass");

        $(".ringList").append(newRingTag);

        $(textoRing).css({
            "pointer-events": "none",
            "top": letraO.parentElement.getBoundingClientRect().y,
            "left": letraO.parentElement.getBoundingClientRect().x + 25
        })

        conteoRing += 1;

        textoRing.textContent = conteoRing
        textoRing.classList.add("ringCounter")

        $(".ringList").append(textoRing);

        setTimeout(() => {
            newRingTag.remove();
            textoRing.remove();
        }, 4000);
    })

}

//! Funciones de sonido

async function cargaSonido(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function reproduceSonido(nameVar, customVol = 0.05, isLoop = false, loopStart = 0, loopEnd = 0, setOffset = 0, delay = 1) {
    if (!nameVar) return;

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    source.buffer = nameVar;
    gainNode.gain.value = customVol;
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.loop = isLoop
    source.loopStart = loopStart;
    source.loopEnd = loopEnd;
    setTimeout(() => {
        console.log("A");
        source.start(0, setOffset);
    }, delay);
    source.onended = () => {
        source.stop()
    }
    return [source, gainNode];
}

function tuneDown(currentBuffer) {
    let intervalTune = setInterval(() => {
        if (currentBuffer[0].playbackRate.value > .05 && currentBuffer[1].gain.value > 0) {
            currentBuffer[0].playbackRate.value -= (1 / currentBuffer[0].playbackRate.value / 60);
            currentBuffer[1].gain.value -= (1 / currentBuffer[0].playbackRate.value / 60) / 5;
        } else {
            currentBuffer[0].stop();
            clearInterval(intervalTune)
        }
    }, 90);
}

function lowerVolume(currentBuffer, stepDown = 4) {
    let soundGain = currentBuffer[1];
    let intervalOff = setInterval(() => {
        if (soundGain.gain.value > 0) {
            soundGain.gain.value -= (soundGain.gain.value / stepDown < 0.01 ? (0.05) : soundGain.gain.value / stepDown);
        } else {
            soundGain.gain.value = 0;
            clearInterval(intervalOff)
        }
        console.log(soundGain.gain.value);
    }, 50);
}

function turnOff(currentBuffer, stepDown = 4) {
    let soundGain = currentBuffer[1];
    let intervalOff = setInterval(() => {
        if (soundGain.gain.value > 0) {
            soundGain.gain.value -= (soundGain.gain.value / stepDown);
        } else {
            currentBuffer[0].stop();
            clearInterval(intervalOff)
        }
    }, 50);
}

function turnUp(currentBuffer, topVol = .05, increaseNum = 0.05) {
    let soundGain = currentBuffer[1];
    if (increaseNum > topVol) {
        soundGain.gain.value = topVol
        return;
    };
    let intervalUp = setInterval(() => {
        if (soundGain.gain.value < topVol) {
            soundGain.gain.value += increaseNum;
        } else {
            clearInterval(intervalUp)
        }
    }, 50);
}