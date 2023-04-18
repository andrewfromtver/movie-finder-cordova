import WebTorrent from 'webtorrent'

export let file

export const getTorrentByMagnet = async (torFile) => {
    
    const client = new WebTorrent()

    client.add(torFile, torrent => {
        // Got torrent metadata!
        console.log('Client is downloading:', torrent.infoHash)

        file = torrent.files.find(function (file) {
            return file.name.endsWith('.mp4')
        })

        if (file) file.appendTo('#output')
        setInterval(() => {
            if (window.location.href.includes("webtorrent")) {
                const percent = Math.round(torrent.progress * 100 * 100) / 100
                progressBar.style.width = percent + '%'
            } else return
        }, 500)
    })

}
