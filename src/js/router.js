// Bootstrap
import * as bootstrap from "bootstrap";

// Assets
import noContent from '../assets/404.gif'

// App imports
import { lang, translate } from "./lang";
import {
  renderTrendingCards,
  renderItem,
  renderSearchResults,
  renderFavorites,
  renderNativeTorrentPlayer,
  renderWebTorPlayer,
  renderSettingsTab,
} from "./render";
import { wideScreenFrame } from "./render";
import { torrentSearchApi } from "./main";

// App router engine
export const stateListener = () => {
  closeSideBarBtn.click();
  let href = window.location.href;
  if (href.includes("trending")) {
    let type = href.split("_")[1];
    let time = href.split("_")[2];
    renderTrendingCards(type, time);

    homeLink.classList = "nav-link active";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("show")) {
    let type = href.split("_")[1];
    let id = href.split("_")[2];
    renderItem(type, id);

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("search")) {
    let query = href.split("_")[1];
    renderSearchResults(query);

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("webtorrent")) {
    renderNativeTorrentPlayer();

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link active";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("play")) {
    container.innerHTML = `
            <div class="d-flex justify-content-center" style="margin-top: 40vh;">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `;
    if (localStorage.getItem("search_api_server")) {
      fetch(
        `${torrentSearchApi}/api/torrent-search?t=Movies&q=${
          href.split("_")[1]
        }`
      )
        .then((result) => {
          if (result.status === 200) return result.json();
          else {
            const message = new bootstrap.Toast(toast);
            let i = 0;
            if (lang === "ru") i = 1;
            toastMsg.innerText = result.status;
            message.show();
          }
        })
        .then((result) => {
          renderWebTorPlayer();
          magnetUrl.value = result.result;
          let htmlPage = `
                        <!doctype html>
                        <html>
                            <head>
                                <title>Webtor Player SDK Example</title>
                                <meta charset="utf-8">
                                <meta content="width=device-width, initial-scale=1" name="viewport">
                                <meta content="ie=edge" http-equiv="x-ua-compatible">
                                <style>
                                    html, body, iframe {
                                        margin: 0;
                                        padding: 0;
                                        width: 100%;
                                        height: 100%;
                                    }
                                </style>
                                <script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charset="utf-8" async></script>
                            </head>
                            <body>
                                <video controls src="${magnetUrl.value}"></video>
                            </body>
                        </html>
                    `;
          output.srcdoc = htmlPage;
          wideScreenFrame();
          webTorrentForm.hidden = true;
          torrentPlayerTitle.innerText = decodeURI(href.split("_")[1]);
        });
    } else {
      const message = new bootstrap.Toast(toast);
      let i = 0;
      if (lang === "ru") i = 1;
      toastMsg.innerText = translate[i].data[19];
      message.show();
      container.innerHTML = `
        <section>
        <div class="container px-4 px-lg-5 my-5">
        <div class="row gx-4 gx-lg-5 align-items-center">
            <div class="col-md-6">
                <img class="card-img-top mb-5 mb-md-0" src="${noContent}">
            </div>
            <div class="col-md-6">
                <div style="text-align: center;" class="fs-5 mb-2">
                    <button style="width: 128px;" type="button" class="btn btn-success m-0 p-0">
                        <a class="m-0 p-1 nav-link text-light" aria-current="page" href="#trending_all_week">
                            ${translate[i].data[8]}
                        </a>
                    </button>
                </div>
            </div>
        </div>
    </div>
        </section>
      `
    }

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("favorites")) {
    renderFavorites(localStorage.getItem("favorites"));

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link active";
    settingsLink.classList = "nav-link";
  } else if (href.includes("settings")) {
    renderSettingsTab();

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link active";
  } else {
    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  }
};
