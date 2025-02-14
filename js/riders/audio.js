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

Promise.resolve(cargaSonido(`sound/riders/gravityDive.ogg`).then(buffer => soundPressStart = buffer))

if (showLogo) {

    Promise.all([
        cargaSonido("sound/ring.wav").then(buffer => soundRing = buffer),
    ]).then(() => {
        console.log("Come on! Step it up!");
    });

    $(document).on("click", ".textoSonicRow", function () {
        reproduceSonido(soundRing)
    })

}

//! Funciones de sonido

async function cargaSonido(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await audioContext.decodeAudioData(arrayBuffer);
}

function reproduceSonido(nameVar, customVol = 0.05, isLoop = false, loopStart = 0, loopEnd = 0, setOffset = 0) {
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
    source.start(0, setOffset);
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
    let intervalUp = setInterval(() => {
        if (soundGain.gain.value < topVol) {
            soundGain.gain.value += increaseNum;
        } else {
            clearInterval(intervalUp)
        }
    }, 50);
}