chrome.runtime.onMessage.addListener(msg => {
    if ('play' in msg) playAudio(msg.play);
});

function playAudio({ source, volume }) {
    const audio = new Audio(source);
    audio.volume = volume;
    audio.play();
}