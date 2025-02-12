let videoSource = document.createElement("source"),
    videoContainer = document.querySelector("#backgroundVideo")

storage.sync.get(["globalConfig"], async function (obj) {
    let globalConfig = obj.globalConfig
    videoSource.src = globalConfig.videoSD

    console.log(globalConfig)

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


