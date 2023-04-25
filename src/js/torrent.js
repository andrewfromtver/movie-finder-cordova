// App imports
import WebTorrent from "webtorrent";
import * as bootstrap from "bootstrap";
import { lang, translate } from "./lang";

// App vars
export let file;
let client;
let interval;

// Torrent search API
export const getTorrentByMagnet = async (torFile) => {
  if (interval) clearInterval(interval);
  if (client) client.destroy();
  outputVideo.src = "";
  client = new WebTorrent();

  client.add(torFile, (torrent) => {
    file = torrent.files.find(function (file) {
      return file.name.endsWith(".mp4");
    });

    if (file && file._torrent.announce) {
      let isWebTorrent = false;
      file._torrent.announce.forEach((element) => {
        if (
          element.includes("wss://") ||
          element.includes("ws://") ||
          element.includes("http://")
        )
          isWebTorrent = true;
      });
      if (isWebTorrent) {
        console.log("Client is downloading:", torrent.infoHash);
        file.renderTo("#outputVideo");
        interval = setInterval(() => {
          if (window.location.href.includes("webtorrent")) {
            const percent = Math.round(torrent.progress * 100 * 100) / 100;
            progressBar.style.width = percent + "%";
          } else return;
        }, 500);
      } else {
        const message = new bootstrap.Toast(toast);
        let i = 0;
        if (lang === "ru") i = 1;
        toastMsg.innerText = translate[i].data[9];
        message.show();
      }
    }
  });
};
