// webmanifest import
import manifest from "../manifest.webmanifest";

// Assets
import logo from "../assets/logo.jpeg";
import searchIco from "../assets/search.svg";
import menuIco from "../assets/menu.svg";
import homeIco from "../assets/home.svg";
import favoritesIco from "../assets/favorites.svg";
import settingsIco from "../assets/settings.svg";
import playIco from "../assets/play.svg";
import bgVideo from "../assets/bg.mp4";

// App import
import { lang, translate } from "./lang";
import { stateListener } from "./router";
import { wideScreenFrame } from "./render";

// Servers
export let torrentSearchApi = "https://localhost";
export let allowTorrents = false;
if (
  localStorage.getItem("use_webtor") &&
  localStorage.getItem("use_webtor") == 1
) {
  allowTorrents = true;
}
export let searchSiteDomain = "";
if (localStorage.getItem("search_domain")) {
  searchSiteDomain = localStorage.getItem("search_domain");
}
export let longVideosSearchParam = "0";
if (
  localStorage.getItem("long_videos") &&
  localStorage.getItem("long_videos") == 1
) {
  longVideosSearchParam = localStorage.getItem("long_videos");
}
export let searchSite = `&as_sitesearch=${searchSiteDomain}`;
export let imdbApi = "https://api.themoviedb.org";
export let imdbImageStore = "https://image.tmdb.org";

// Api keys
export let apiKey = "api_key=dcaf7f5ea224596464b7714bac28142f";
if (!!localStorage.getItem("imdb_api_server")) {
  apiKey = "";
}

// Data collector
const userData = (
  callbac = (data) => {
    console.log(data);
  }
) => {
  let Url = "https://" + "cloudflare.com/cdn-cgi/trace";
  let AjaxUrl = new XMLHttpRequest();
  AjaxUrl.open("get", Url);
  AjaxUrl.send();

  AjaxUrl.onreadystatechange = function () {
    if (AjaxUrl.readyState === 4 && AjaxUrl.status === 200) {
      let resultUrl = AjaxUrl.responseText;
      let mapUrlStart = resultUrl.indexOf("ip") + 3;
      let mapUrlEnd = resultUrl.indexOf("ts") - 1;
      let mapDevStart = resultUrl.indexOf("uag") + 4;
      let mapDevEnd = resultUrl.indexOf("colo") - 1;
      let IpResult = resultUrl.slice(mapUrlStart, mapUrlEnd);
      let DevResult = resultUrl.slice(mapDevStart, mapDevEnd);
      callbac({ ip: IpResult, device: DevResult });
    }
  };
};
const appUsageStat = () => {
  userData((data) => {
    localStorage.setItem("user_data", JSON.stringify(data));
  });
};

// Init
window.onload = () => {
  let inner = `
    <video
      id="backgroundVideo"
      loop
      autoplay
      muted
    >
      <source id="bgVideoSource"
        src="${bgVideo}"
        type="video/mp4"
      />
    </video>
  `;
  app.innerHTML += inner;
  backgroundVideo.play();
  // webmanifest
  document
    .querySelector("#my-manifest-placeholder")
    .setAttribute("href", manifest);

  // text content
  let i = 0;
  if (lang === "ru") i = 1;
  movies.innerText = translate[i].data[0];
  tvs.innerText = translate[i].data[1];
  mixed.innerText = translate[i].data[2];
  persons.innerText = translate[i].data[3];
  queryString.placeholder = translate[i].data[4];

  // assets
  home.src = homeIco;
  play.src = playIco;
  favorites.src = favoritesIco;
  settings.src = settingsIco;
  menuImg.src = menuIco;
  searchImg.src = searchIco;
  brand.src = logo;

  // Read lang settings
  if (localStorage.getItem("lang") && localStorage.getItem("lang") == 1) {
    langSwitch.checked = true;
  } else {
    langSwitch.checked = false;
  }
  // read saved servers
  if (localStorage.getItem("ui_scale")) {
    let scale = localStorage.getItem("ui_scale");
    app.style = `zoom: ${scale}; -moz-transform: scale(${scale}); -moz-transform-origin: 0 0;`;
    document.documentElement.style.setProperty("--zoom", scale);
  }
  if (localStorage.getItem("search_api_server")) {
    torrentSearchApi = localStorage.getItem("search_api_server");
  }
  if (localStorage.getItem("imdb_api_server")) {
    imdbApi = localStorage.getItem("imdb_api_server");
  }
  if (localStorage.getItem("imdb_images_server")) {
    imdbImageStore = localStorage.getItem("imdb_images_server");
  }

  // read saved user data
  if (!localStorage.getItem("favorites")) {
    localStorage.setItem("favorites", "[]");
  }

  if (
    localStorage.getItem("videa_background") &&
    localStorage.getItem("videa_background") == 0
  ) {
    backgroundVideo.hidden = true;
  }

  // toggles control
  langSwitch.onchange = () => {
    langSwitch.checked
      ? localStorage.setItem("lang", 1)
      : localStorage.setItem("lang", 0);
    window.location.reload();
  };

  // search init
  searchForm.onsubmit = () => {
    event.preventDefault();
    window.location.href = `#search_|_${queryString.value}`;
  };

  // router init
  window.addEventListener("popstate", stateListener);

  // show app after content loaded
  app.hidden = false;

  window.addEventListener("resize", wideScreenFrame);
  // app init
  stateListener();
  appUsageStat();
};
