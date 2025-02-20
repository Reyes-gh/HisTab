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
const analyser = audioContext.createAnalyser();

Promise.all([
    cargaSonido("sound/riders/extras.ogg").then(buffer => menuExtras = buffer),
    cargaSonido("sound/riders/menu_confirm.wav").then(buffer => menuConfirm = buffer),
    cargaSonido("sound/riders/menu_question.wav").then(buffer => menuQuestion = buffer),
]).then(() => {
    console.log("READY... GO!");
});

if (showLogo) {

    Promise.all([
        cargaSonido("sound/ring.wav").then(buffer => soundRing = buffer),
    ]).then(() => {
        console.log("Ring loaded");
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

const canvas = document.querySelector("#audioVisualizer");
const canvasCtx = canvas.getContext("2d");
const mediaStreamDestination = audioContext.createMediaStreamDestination();

function reproduceSonido(nameVar, customVol = .05, isLoop = false, loopStart = 0, loopEnd = 0, setOffset = 0, delay = 1) {
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
        source.start(0, setOffset);
    }, delay);
    source.onended = () => {
        source.stop()
    }
    return [source, gainNode];
}

function reproduceSonidoVisual(nameVar, customVol = .05, isLoop = false, loopStart = 0, loopEnd = 0, setOffset = 0, delay = 1) {

    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    source.buffer = nameVar;
    gainNode.gain.value = customVol;
    source.connect(gainNode);
    source.loop = isLoop
    source.loopStart = loopStart;
    source.loopEnd = loopEnd;

    setTimeout(() => {
        source.start(0, setOffset);
    }, delay);
    source.onended = () => {
        source.stop()
    }

    // Crear un destino de MediaStream para capturar el audio
    gainNode.connect(mediaStreamDestination); // Conectar la ganancia al destino

    // Obtener el MediaStream correcto
    const mediaS = mediaStreamDestination.stream;
    const distortion = audioContext.createWaveShaper()

    // Conectar al visualizador
    const visualizer = audioContext.createMediaStreamSource(mediaS);
    analyser.fftSize = 16384;
    visualizer.connect(analyser);
    analyser.connect(distortion);
    distortion.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    draw();

    function draw() {
        analyser.getByteTimeDomainData(dataArray);
        requestAnimationFrame(draw);

        // Limpiar el canvas con una mayor resolución
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
        canvasCtx.fillStyle = "transparent";
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
        canvasCtx.lineWidth = 10;
        canvasCtx.strokeStyle = "rgb(255, 255, 255)";
        canvasCtx.beginPath();

        const sliceWidth = (canvas.width / bufferLength); // Ajustar el espacio entre puntos
        let x = 0;

        const scaleFactor = 2.0; // Aumenta el tamaño de la onda visualmente

        for (let i = 0; i < bufferLength; i++) {
            const v = (dataArray[i] / 128.0 - 1) * scaleFactor + 1; // Escala sin modificar el centro
            const y = v * (canvas.height / 2);

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height / 2);
        canvasCtx.stroke();
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

function lowerVolume(currentBuffer, stepDown = 0.005) {
    let soundGain = currentBuffer[1];
    let intervalOff = setInterval(() => {
        if (soundGain.gain.value > 0) {
            soundGain.gain.value -= stepDown;
        } else {
            soundGain.gain.value = 0;
            clearInterval(intervalOff)
        }
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