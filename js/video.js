let videoSource = document.createElement("source"),
    videoContainer = document.querySelector("#backgroundVideo")

//! Configuración predeterminada
storage.sync.get({
    'globalConfig': {
        videoSD: "video/kingdom_low.mp4",
        videoHD: "video/kingdom3.mp4",
    }
}, async function (obj) {
    let globalConfig = obj.globalConfig;
    let isDesktop = window.innerWidth > 768;
    videoSource.src = globalConfig.videoSD;

    if (isDesktop) {
        try {
            let res = await fetch(globalConfig.videoHD, { method: "HEAD" });
            if (res.ok) videoSource.src = globalConfig.videoHD;
        } catch (err) {
            console.log("HD File error:", err);
        }
    }
    videoContainer.appendChild(videoSource);
    console.log("Done loading video!");
});