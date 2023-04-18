const TorrentSearchApi = require('torrent-search-api');

TorrentSearchApi.enableProvider('Torrent9');

// Search '1080' in 'Movies' category and limit to 20 results
const torrents =  TorrentSearchApi.search('', 'Movies', 1);

torrents.then(res => {
    console.log(res);
    const torrentHtmlDetail = TorrentSearchApi.getTorrentDetails(res[0]).then(res => {
        console.log(res);
    })
})
