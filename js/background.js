
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "back") {
        // Llama a tu función aquí
        playSound(message.params)
        console.log("Función en background.js llamada");
        sendResponse({ status: "success" });
    }
    return true; // Para permitir respuesta asincrónica
});

/**
 * Plays audio files from extension service workers
 * @param {string} source - path of the audio file
 * @param {number} volume - volume of the playback
 */
async function playSound([source, volume] = params) {
    await createOffscreen();
    await chrome.runtime.sendMessage({ play: { source, volume } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: '../offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'testing' // details for using the API
    });
}
