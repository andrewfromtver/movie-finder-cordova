// Assets
import logo from "../assets/logo.jpeg";
import searchIco from "../assets/search.svg";
import menuIco from "../assets/menu.svg";
import homeIco from "../assets/home.svg";
import favoritesIco from "../assets/favorites.svg";
import settingsIco from "../assets/settings.svg";
import playIco from "../assets/play.svg";

// App import
import { lang, translate } from "./lang";
import { stateListener } from "./router";
import { wideScreenFrame } from "./render";

// Servers
export let torrentSearchApi = "https://localhost";
export let imdbApi = "https://api.themoviedb.org";
export let imdbImageStore = "https://image.tmdb.org";

// Api keys
export let apiKey = "";

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

  // read saved servers
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

  // toggles control
  langSwitch.onchange = () => {
    langSwitch.checked
      ? sessionStorage.setItem("lang", 1)
      : sessionStorage.setItem("lang", 0);
    window.location.reload();
  };

  // search init
  searchForm.onsubmit = () => {
    event.preventDefault();
    window.location.href = `#search_${queryString.value}`;
  };

  // router init
  window.addEventListener("popstate", stateListener);

  // show app after content loaded
  app.hidden = false;

  window.addEventListener('resize', wideScreenFrame)
  // app init
  stateListener();
  appUsageStat();
};
