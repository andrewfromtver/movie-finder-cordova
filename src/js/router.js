// App imports
import {
  renderTrendingCards,
  renderItem,
  renderSearchResults,
  renderFavorites,
  renderNativeTorrentPlayer,
  renderSettingsTab,
  renderTorrentLiveVideo,
} from "./render";

// App router engine
export const stateListener = () => {
  closeSideBarBtn.click();
  let href = window.location.href;
  if (href.includes("trending")) {
    let type = href.split("_|_")[1];
    let time = href.split("_|_")[2];
    let page = href.split("_|_")[3];
    renderTrendingCards(type, time, page);

    homeLink.classList = "nav-link active";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("show")) {
    let type = href.split("_|_")[1];
    let id = href.split("_|_")[2];
    renderItem(type, id);

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  } else if (href.includes("search")) {
    let query = href.split("_|_")[1];
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
    renderTorrentLiveVideo();

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
    window.location.href = "#trending_|_all_|_week_|_1";

    homeLink.classList = "nav-link";
    randomfindmachineLink.classList = "nav-link";
    favoritesLink.classList = "nav-link";
    settingsLink.classList = "nav-link";
  }
};
