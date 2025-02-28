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

    const rankingRequirements = [
        { minCalc: 10, minRings: 310, rank: "S" },
        { minCalc: 8, minRings: 220, rank: "A" },
        { minCalc: 5, minRings: 140, rank: "B" },
        { minCalc: 3, minRings: 80, rank: "C" },
        { minCalc: 0, minRings: 0, rank: "D" }
    ];

    rankingRequirements.forEach(ranking => {
        const rank = ranking.rank.toUpperCase();
        const img = document.createElement("img");
        img.src = `images/ranks/rank${rank}.png`;
        img.classList.add("scoreRank");
        ranking.img = img;
    });

    function getRank(finalCalc, finalRing) {
        const rank = rankingRequirements.find(r => finalCalc >= r.minCalc && finalRing >= r.minRings);
        return rank.img;
    }

    Promise.all([
        cargaSonido("sound/ring.wav").then(buffer => soundRing = buffer),
        cargaSonido("sound/sonic/sonicNo.wav").then(buffer => soundSonicNo = buffer),
        cargaSonido("sound/sonic/sonicOkay.wav").then(buffer => soundSonicOkay = buffer),
        cargaSonido("sound/sonic/sonicYeah.wav").then(buffer => soundSonicYeah = buffer),
        cargaSonido("sound/sonic/sonicYes.wav").then(buffer => soundSonicYes = buffer),
        cargaSonido("sound/sonic/sonicSweet.wav").then(buffer => soundSonicSweet = buffer),
        cargaSonido("sound/sonic/sonicFeelingGood.wav").then(buffer => soundSonicFeelingGood = buffer),
        cargaSonido("sound/sonic/sonicSuper.mp3").then(buffer => soundSonicSuper = buffer),
        cargaSonido("sound/sonic/sonicNowIllShowYou.mp3").then(buffer => soundSonicNowIllShowYou = buffer),
        cargaSonido("sound/sonic/sonicAppears.mp3").then(buffer => soundSonicAppears = buffer),
        cargaSonido("sound/sonic/sonicHisWorldInstrumental.ogg").then(buffer => soundSonicHisWorldInstrumental = buffer),
        cargaSonido("sound/sonic/sonicResults.mp3").then(buffer => soundSonicResults = buffer),
        cargaSonido("sound/sonic/sonicScore.wav").then(buffer => soundSonicScore = buffer),
        cargaSonido("sound/sonic/sonicRank.wav").then(buffer => soundSonicRank = buffer),
    ]).then(() => {
        console.log("Come on! Step it up!");
    });

    $(".textoLetra").on("mousedown", function () {
        // RING SOUND
        if ($(this).hasClass("letraO")) {

            //! Formula spin progresivo
            //console.log(letraO.style.transform = `rotate(${conteoRing * (conteoRing / 15)}deg)`)

            if (!timerActive && conteoRing >= 25) {
                timerActive = true;
                timerTime = Date.now();
                finalTime = 0;
                if (bufferResults != undefined) turnOff(bufferResults);
            }

            sonicRowText.classList.add("withTransition")
            backgroundVideo.classList.add("withTransition")

            reproduceSonido(soundRing, .02)

            clearTimeout(timeoutTransition)
            timeoutTransition = setTimeout(() => {
                backgroundVideo.classList.remove("withTransition")
            }, 1200);
            clearTimeout(timeoutRings)

            conteoRing += 1;

            let newRingTag = document.createElement("img")
            let textoRing = document.createElement("div");

            newRingTag.setAttribute("src", "images/ring.gif")
            newRingTag.style.left = Math.random(100) * 100 + "%";
            newRingTag.classList.add("ringClass");

            $(".ringList").append(newRingTag);

            $(textoRing).css({
                "top": letraO.getBoundingClientRect().y,
                "left": letraO.getBoundingClientRect().x + 25
            })

            textoRing.textContent = conteoRing
            textoRing.classList.add("ringCounter")

            $(".ringList").append(textoRing);

            setTimeout(() => {
                newRingTag.remove();
                textoRing.remove();
            }, 4000);

            switch (conteoRing) {
                case 25:
                    reproduceSonido(soundSonicOkay);
                    break;
                case 50:
                    reproduceSonido(soundSonicYeah);
                    break;
                case 75:
                    reproduceSonido(soundSonicYes, .08)
                    break;
                case 100:
                    reproduceSonido(soundSonicSweet, .08)
                    break;
                case 150:
                    reproduceSonido(soundSonicFeelingGood, .08)
                    break;
                case 185:
                    setTimeout(() => {
                        currentGlobal = currentAppear = reproduceSonido(soundSonicAppears, .15)
                    }, 300);
                    break;
                case 200:
                    reproduceSonido(soundSonicNowIllShowYou, .3)
                    setTimeout(() => {
                        reproduceSonido(soundSonicSuper, .5);
                        backgroundVideo.classList.add("superSonic")
                        sonicRowText.classList.add("superSonic")
                    }, 500);
                    break;
                case 500:
                    turnOff(currentAppear);
                    currentGlobal = currentHisWorldInstrumental = reproduceSonido(soundSonicHisWorldInstrumental, 0, true, 34.2, 102.95, 48.4);
                    turnUp(currentHisWorldInstrumental, .15)
                    break;
            }

            if (conteoRing > 25) {
                timeoutRings = setTimeout(() => {
                    finalRing = conteoRing;
                    conteoRing = 0;

                    reproduceSonido(soundSonicNo)

                    finalTime = (Date.now() - timerTime) / 1000;
                    timerActive = false;

                    sonicRowText.classList.remove("superSonic")
                    backgroundVideo.classList.remove("superSonic")

                    if (currentGlobal != undefined) {
                        tuneDown(currentGlobal);
                    }

                    //! Fórmula elTele;
                    let finalCalc = (finalRing / finalTime) - 5;

                    console.log(finalCalc, finalRing)
                    setTimeout(() => {
                        document.querySelector(".rankContainer").append(getRank(finalCalc, finalRing));
                        setTimeout(() => {
                            reproduceSonido(soundSonicRank)
                            setTimeout(() => {
                                if (bufferResults != undefined) turnOff(bufferResults)
                                bufferResults = reproduceSonido(soundSonicResults)
                                setTimeout(() => {
                                    turnOff(bufferResults, 10)
                                }, 3500);
                            }, 700);
                        }, 700);
                    }, 1000);

                }, 500);
            }

        }
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