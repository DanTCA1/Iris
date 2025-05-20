document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById('zipFile');

    fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        JSZip.loadAsync(file)
        .then((zip) => {
        const fileEntries = zip.files;
        const fileBlobs = {};

        const promises = Object.keys(fileEntries).map((filename) => {
            const zipEntry = fileEntries[filename];

            if (zipEntry.dir) {
            return Promise.resolve();
            }

            return zipEntry.async("blob").then((blob) => {
            fileBlobs[filename] = blob;
            });
        });

        return Promise.all(promises).then(function() {
            return fileBlobs;
        });
        })
        .then(function(fileBlobs) {
            paths = {}
            for (const filename in fileBlobs) {
                lastPath = "/"
                for (const pathSeg of filename.split("/")) {
                    if (pathSeg.includes(".") && pathSeg != ".git") {
                        elem = document.createElement("p")
                        elem.innerHTML = "└" + pathSeg
                        paths[lastPath].appendChild(elem)
                        elem.className = "file"
                    } else {
                        if (paths[lastPath + pathSeg + "/"] == undefined) {
                            div = document.createElement("div")
                            if (lastPath == "/") {
                                document.getElementById("loadedFiles").appendChild(div)
                            } else {
                                paths[lastPath].appendChild(div)
                            }
                            div.innerHTML = "└" + pathSeg
                            div.className = "folder"
                            lastPath = lastPath + pathSeg + "/"
                            paths[lastPath] = div
                        } else {
                            lastPath = lastPath + pathSeg + "/"
                        }
                    }
                }
            }
        })
        .catch(function(error) {
        console.error("Error processing zip file:", error);
        });
    }
    })
});