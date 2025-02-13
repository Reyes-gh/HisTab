let videoSource = document.createElement("source"),
    videoContainer = document.querySelector("#backgroundVideo")

//! Configuración predeterminada
storage.sync.get({
    'globalConfig': {
        videoSD: "video/kingdom_low.mp4",
        videoHD: "video/kingdom3.mp4",
    }
}, async function (obj) {
    let globalConfig = obj.globalConfig
    videoSource.src = globalConfig.videoSD

    Promise.all([
        fetch(globalConfig.videoHD,
            { method: "HEAD" }
        ).then((res) => {
            if (window.innerWidth > 768) videoSource.src = globalConfig.videoHD;
            videoContainer.appendChild(videoSource)
        }).catch((err) => {
            console.log("HD File not found!")
        })
    ]).then(
        () => {
            console.log("Done loading video!")
            videoContainer.appendChild(videoSource)
        }
    )
})