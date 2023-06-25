// Bootstrap
import "../scss/styles.scss";
import * as bootstrap from "bootstrap";
// html2canvas
import html2canvas from 'html2canvas';
// Assets
import noContent from "../assets/404.gif";
import noImage from "../assets/no-image.png";
import errorMsg from "../assets/error.png";
import trailerIco from "../assets/trailer.svg";
import expandIco from "../assets/expand.svg";
import recommendationsIco from "../assets/recommendations.svg";
import deleteIco from "../assets/delete.svg";
import playIco from "../assets/play.svg";
import searchIco from "../assets/search.svg";
import favoritesIco from "../assets/favorites.svg";
import shareIco from "../assets/share.svg";
// App imports
import { lang, translate } from "./lang";
import {
  getTrending,
  getFullInfo,
  getRecommendations,
  getItemsByPerson,
  searchEngine,
  getTrailers,
} from "./api";
import {
  imdbImageStore,
  allowTorrents,
  searchSite,
  longVideosSearchParam,
} from "./main";
import { file, getTorrentByMagnet } from "./torrent";
import { torrentSearchApi } from "./main";

// Data render
export const renderItem = (type, id) => {
  container.innerHTML = `
    <div class="d-flex justify-content-center">
      <div style="color: #fff;" class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  `;
  getFullInfo(type, id, 
    (data) => {
      let episodeCount = [];
      let episodeCountInner = "";
      if (type === "tv") {
        data.seasons.forEach((element) => {
          episodeCount.push({ name: element.name, qty: element.episode_count });
        });
        let i = 0;
        if (lang === "ru") i = 1;
        episodeCountInner = `
          <thead>
            <tr>
              <th>${translate[i].data[20]}</th>
              <th>${translate[i].data[21]}</th>
            </tr>
          </thead>
        `;
      } else {
        episodeCount = [];
      }
      episodeCount.forEach((element) => {
        episodeCountInner += `
          <tbody>
            <tr>
              <td>${element.name}</td>
              <td>${element.qty}</td>
            </tr>
          </tbody>
        `;
      });
      sessionStorage.setItem("seasons", JSON.stringify(episodeCount));
      let showButtonText = `<img class="ico" src="${recommendationsIco}">`;
      let similarButton = "";
      if (type !== "person") {
        showButtonText = `<img class="ico" src="${trailerIco}">`;
        similarButton = `
                  <button id="showSimilar" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                      
                      <img class="ico" src="${recommendationsIco}">
                  </button>
              `;
        if (allowTorrents) {
          similarButton += `
            <button id="findTorrent" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
              
              <img class="ico" src="${playIco}">
            </button>
          `;
        } else {
          let searchQuery = data.title || data.name;
          if (type === "movie") {
            searchQuery += " " + data.release_date.split("-")[0];
          } else {
            searchQuery += " " + data.last_air_date.split("-")[0];
          }
          searchQuery += searchSite;
          let searchParam = "";
          if (longVideosSearchParam == 1) searchParam = "&tbm=vid&tbs=dur:l";
          similarButton += `
          <a href="https://www.google.com/search?q=${searchQuery}${searchParam}" target=”_blank”>
            <button id="findTorrent" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
              
              <img class="ico" src="${searchIco}">
            </button>
          </a>
          `;
        }
      }
      let scoreColor = "#dc3545";
      let scorePadding = "auto";
      if (data.vote_average > 5) scoreColor = "#fd7e14";
      if (data.vote_average > 7.5) scoreColor = "#13795b";
      if (data.vote_average || data.birthday) scorePadding = "8px";
      let genList = "";
      if (type !== "person") {
        data.genres.forEach((element) => {
          genList += `${element.name} `;
        });
      }
      let imgSrc = noImage;
      if (data.poster_path || data.profile_path) {
        imgSrc = `${imdbImageStore}/t/p/w500/${
          data.poster_path || data.profile_path
        }`;
      }
      let searchDate = "";
      if (data.release_date) searchDate = data.release_date.split("-")[0];
      document.title = data.title || data.name;
      let inner = `
              <section>
                  <div class="container">
                      <div class="row gx-4 gx-lg-5 align-items-center">
                          <div class="col-md-6"><img id="itemImg"class="shadow-sm card-img-top mb-5 mb-md-0" style="border-radius: 8px;" src="${imgSrc}" alt="" /></div>
                          <div class="col-md-6" id="itemDescriptionForShare">
                              <p hidden id="originalTitle">${
                                data.original_title || data.original_name
                              } ${searchDate}</p>
                              <h1 id="itemTitle" class="display-5 fw-bolder">${
                                data.title || data.name
                              }</h1>
                              <div class="fs-5 mb-2">
                                  <span id="itemTag">${data.tagline || ""}</span>
                              </div>
                              <div class="fs-5 mb-3">
                                  <span style="color: #13795b;" class="fw-bolder" id="itemGenres">${
                                    genList || ""
                                  }</span>
                              </div>
                              <div class="fs-5 mb-4">
                                  <span id="itemDate" style="padding: ${scorePadding}; color: #fff; background-color: ${scoreColor};">${
        data.vote_average || data.birthday || ""
      }</span>
                              </div>
                              <p class="lead">${
                                data.overview || data.biography || ""
                              }</p>
                              <div  style="color: #dc3545;" class="pb-2">${
                                data.release_date || data.last_air_date || ""
                              }</div>
                              <table style="width: 100%;" id="seasonsTable">${episodeCountInner}</table>
                              <div class="mt-4 d-flex" id="itemControllButtons">
                                  <button id="showRecommendations" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                                      ${showButtonText}
                                  </button>
                                  ${similarButton}
                                  <button id="${
                                    data.id
                                  }" class="addToFavorites m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                                      <img class="ico" src="${favoritesIco}">
                                  </button>
                                  <button id="shareContent" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                                      <img class="ico" src="${shareIco}">
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
              <section style="width: 100%;" id="recommendations"></section>
              <section style="width: 100%;" id="trailers"></section>
      `;
      container.innerHTML = inner;
      shareContent.onclick = () => {
        printDiv(itemDescriptionForShare)
      }
      showRecommendations.onclick = () => {
        setTimeout(() => {
          showRecommendations.hidden = true;
        }, 500);
        renderAddons(type, id);
      };
      if (type !== "person") {
        showSimilar.onclick = () => {
          setTimeout(() => {
            showSimilar.hidden = true;
          }, 250);
          renderRecommendations(type, id);
        };
        if (allowTorrents) {
          findTorrent.onclick = () => {
            window.location.hash = `#play_|_${originalTitle.innerText}`;
          };
        }
      }
      const addItemToFavorites = (id, type, tytle, subtytle, img) => {
        const message = new bootstrap.Toast(toast);
        let i = 0;
        if (lang === "ru") i = 1;
        if (localStorage.getItem("favorites")) {
          let userData = JSON.parse(localStorage.getItem("favorites"));
          let newObj = {
            id: id,
            type: type,
            title: tytle,
            subtitle: subtytle,
            img_path: img,
          };
          let unique = true;
          userData.forEach((element) => {
            if (element.id + element.type == id + type) {
              unique = false;
            }
          });
          if (unique) {
            userData.push(newObj);
            localStorage.setItem("favorites", JSON.stringify(userData));
            toastMsg.innerText = translate[i].data[14];
          } else {
            toastMsg.innerText = translate[i].data[15];
          }
        } else {
          toastMsg.innerText = translate[i].data[16];
        }
        message.show();
      };
      document.querySelectorAll(".addToFavorites").forEach((element) => {
        element.onclick = () => {
          let tag = itemTag.innerText;
          if (window.location.href.split("_|_")[1] === "person")
            tag = itemDate.innerText;
          addItemToFavorites(
            element.id,
            window.location.href.split("_|_")[1],
            itemTitle.innerText,
            tag,
            itemImg.src
          );
        };
      });
    },
    (error) => {
      const message = new bootstrap.Toast(toast);
      toastMsg.innerText = error;
      message.show();
      let i = 0;
      if (lang === "ru") i = 1;
      container.innerHTML = `
        <section>
          <div class="container">
              <div class="row gx-4 gx-lg-5 align-items-center">
                  <div class="col-md-6">
                      <img class="card-img-top mb-5 mb-md-0" src="${errorMsg}">
                  </div>
                  <div class="col-md-6">
                      <h1 class="display-5 fw-bolder">
                        ${translate[i].data[25]}
                      </h1>
                      <div class="fs-5 mb-2">
                          <span id="itemTag">
                              ${translate[i].data[24]}
                          </span>
                      </div>
                      <div class="fs-5 mb-2">
                          <button style="width: 128px;" type="button" class="btn btn-success m-0 p-0">
                              <a class="m-0 p-1 nav-link text-light" aria-current="page" href="#settings">
                                  ${translate[i].data[22]}
                              </a>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      `;
    }
  );
};
const renderAddons = (type, id) => {
  if (["movie", "tv", "all"].includes(type))
    getTrailers(
      type,
      id,
      (data) => {
        let inner = `
            <div class="container">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12 accordion" id="accordionTrailers">
        `;
        let counter = 1;
        let showToggle = "show";
        let showClasslist = "accordion-button";
        data
          .reverse()
          .slice(0, 5)
          .forEach((element) => {
            let noOfficialTrailers = true;
            if (lang === "en") noOfficialTrailers = element.official;
            if (noOfficialTrailers) {
              if (counter !== 1) {
                showToggle = "";
                showClasslist = "accordion-button collapsed";
              }
              inner += `
                        <div class="shadow-sm accordion-item">
                            <h2 class="accordion-header">
                            <button class="${showClasslist}" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse-${counter}" aria-controls="panelsStayOpen-collapse-${counter}">
                                ${element.name}
                            </button>
                            </h2>
                            <div id="panelsStayOpen-collapse-${counter}" class="accordion-collapse collapse ${showToggle}">
                            <div>
                                <iframe 
                                  class="trailerIframe" 
                                  src="https://www.youtube.com/embed/${element.key}" 
                                  frameborder="0"
                                  allow="accelerometer; autoplay; encrypted-media; gyroscope;"
                                  allowfullscreen
                                ></iframe>
                            </div>
                            </div>
                        </div>
                `;
              counter++;
            }
          });
        inner += "</div></div></div>";
        trailers.innerHTML = inner;
        if (document.getElementById("panelsStayOpen-collapse-1")) {
          setTimeout(() => {
            document
              .getElementById("panelsStayOpen-collapse-1")
              .scrollIntoView({ behavior: "smooth", block: "center" });
          }, 250);
        }
      },
      () => {
        const message = new bootstrap.Toast(toast);
        let i = 0;
        if (lang === "ru") i = 1;
        toastMsg.innerText = translate[i].data[6];
        message.show();
      }
    );
  if (type === "person")
    getItemsByPerson(
      "movie",
      id,
      1,
      (data) => {
        let recMovieId;
        let counter = 0;
        let itemState = "";
        let buttonsInner = "";
        let inner = `
            <div class="container">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-8">
                    <div id="recommendationsMovieDate" style="color: #dc3545;" class="pb-1"></div>
                        <h1 id="recommendationsMovieName" class="display-5 fw-bolder"></h1>
                        <div class="fs-5 mb-2">
                            <span id="recommendationsMovieTag"></span>
                        </div>
                        <div class="fs-5 mb-4">
                            <span style="color: #13795b;" class="fw-bolder" id="recommendationsMovieGenres"></span>
                        </div>
                    </div>
                    <div id="carouselRecommendationsMovies" class="col-md-4 carousel-dark carousel slide">
                        <div class="shadow-sm carousel-inner">
                            <div id="indicatorsMovies" style="background-color: #fff; opacity: 0.5; padding: 0 8px;" class="carousel-indicators"></div>
        `;
        data.forEach((element) => {
          let id = element.id;
          counter === 0 ? (itemState = "active") : (itemState = "");
          if (counter === 0) recMovieId = id;
          let imgSrc = noImage;
          if (element.poster_path || element.profile_path) {
            imgSrc = `${imdbImageStore}/t/p/w500/${
              element.poster_path || element.profile_path
            }`;
          }
          inner += `
                <div id="${id}" class="carousel-item ${itemState} movierec" data-bs-interval="10000">
                <a href="#show_|_movie_|_${id}">
                    <img id="loadingTrigger" src="${imgSrc}" class="d-block w-100" alt="${
            element.original_title || element.name
          }">
                </a>
                <div class="carousel-caption d-none d-md-block">
                </div>
                </div>
            `;
          buttonsInner += `
                <button type="button" data-bs-target="#carouselRecommendations" data-bs-slide-to="${counter}" class="active" aria-label="${
            element.original_title || element.name
          }"></button>  
            `;
          counter++;
        });
        inner += `
                        </div>
                        <button id="recSwitchPrev" style="background-color: #fff; height: 56px;" class="m-4 carousel-control-prev" type="button" data-bs-target="#carouselRecommendationsMovies" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button id="recSwitchNext" style="background-color: #fff; height: 56px;" class="m-4 carousel-control-next" type="button" data-bs-target="#carouselRecommendationsMovies" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div id="recommendationsTvs" class="row gx-4 gx-lg-5 align-items-center">
            </div>
        `;
        recommendations.innerHTML = inner;
        indicatorsMovies.innerHTML = buttonsInner;
        getFullInfo("movie", recMovieId, (data) => {
          recommendationsMovieDate.innerText =
            data.release_date || data.last_air_date || "";
          recommendationsMovieName.innerText = data.title || data.name;
          recommendationsMovieTag.innerText = data.tagline || "";
          let genList = "";
          data.genres.forEach((element) => {
            genList += `${element.name} `;
          });
          recommendationsMovieGenres.innerText = genList || "";
        });
        carouselRecommendationsMovies.addEventListener(
          "slide.bs.carousel",
          () => {
            setTimeout(() => {
              let id = document.querySelector(".movierec.active").id;
              getFullInfo("movie", id, (data) => {
                recommendationsMovieDate.innerText =
                  data.release_date || data.last_air_date || "";
                recommendationsMovieName.innerText = data.title || data.name;
                recommendationsMovieTag.innerText = data.tagline || "";
                let genList = "";
                data.genres.forEach((element) => {
                  genList += `${element.name} `;
                });
                recommendationsMovieGenres.innerText = genList || "";
              });
            }, 1050);
          }
        );
        document.querySelectorAll("#loadingTrigger")[0].onload = () => {
          recommendations.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        };
      },
      () => {
        const message = new bootstrap.Toast(toast);
        let i = 0;
        if (lang === "ru") i = 1;
        toastMsg.innerText = translate[i].data[5];
        message.show();
      },
      () => {
        const message = new bootstrap.Toast(toast);
        let i = 0;
        if (lang === "ru") i = 1;
        toastMsg.innerText = translate[i].data[5];
        message.show();
      }
    );
};
const renderRecommendations = (type, id) => {
  getRecommendations(
    type,
    id,
    1,
    (data) => {
      let recMovieId;
      let counter = 0;
      let itemState = "";
      let buttonsInner = "";
      let inner = `
            <div class="container">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-8">
                        <div id="recommendationsMovieDate" style="color: #dc3545;" class="pb-1"></div>
                        <h1 id="recommendationsMovieName" class="display-5 fw-bolder"></h1>
                        <div class="fs-5 mb-2">
                            <span id="recommendationsMovieTag"></span>
                        </div>
                        <div class="fs-5 mb-4">
                            <span style="color: #13795b;" class="fw-bolder" id="recommendationsMovieGenres"></span>
                        </div>
                    </div>
                    <div id="carouselRecommendationsMovies" class="col-md-4 carousel-dark carousel slide">
                        <div class="shadow-sm carousel-inner">
                            <div id="indicatorsMovies" style="background-color: #fff; opacity: 0.5; padding: 0 8px;" class="carousel-indicators"></div>
        `;
      data.forEach((element) => {
        let id = element.id;
        counter === 0 ? (itemState = "active") : (itemState = "");
        if (counter === 0) recMovieId = id;
        let imgSrc = noImage;
        if (element.poster_path || element.profile_path) {
          imgSrc = `${imdbImageStore}/t/p/w500/${
            element.poster_path || element.profile_path
          }`;
        }
        inner += `
                <div id="${id}" class="carousel-item ${itemState} movierec" data-bs-interval="10000">
                <a href="#show_|_${type}_|_${id}">
                    <img id="loadingTrigger" src="${imgSrc}" class="d-block w-100" alt="${
          element.original_title || element.name
        }">
                </a>
                <div class="carousel-caption d-none d-md-block">
                </div>
                </div>
            `;
        buttonsInner += `
                <button type="button" data-bs-target="#carouselRecommendations" data-bs-slide-to="${counter}" class="active" aria-label="${
          element.original_title || element.name
        }"></button>  
            `;
        counter++;
      });
      inner += `
                        </div>
                        <button id="recSwitchPrev" style="background-color: #fff; height: 56px;" class="m-4 carousel-control-prev" type="button" data-bs-target="#carouselRecommendationsMovies" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button id="recSwitchNext" style="background-color: #fff; height: 56px;" class="m-4 carousel-control-next" type="button" data-bs-target="#carouselRecommendationsMovies" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div id="recommendationsTvs" class="row gx-4 gx-lg-5 align-items-center">
            </div>
        `;
      recommendations.innerHTML = inner;
      indicatorsMovies.innerHTML = buttonsInner;

      getFullInfo(type, recMovieId, (data) => {
        recommendationsMovieDate.innerText =
          data.release_date || data.last_air_date || "";
        recommendationsMovieName.innerText = data.title || data.name;
        recommendationsMovieTag.innerText = data.tagline || "";
        let genList = "";
        data.genres.forEach((element) => {
          genList += `${element.name} `;
        });
        recommendationsMovieGenres.innerText = genList || "";
      });
      carouselRecommendationsMovies.addEventListener(
        "slide.bs.carousel",
        () => {
          setTimeout(() => {
            let id = document.querySelector(".movierec.active").id;
            getFullInfo(type, id, (data) => {
              recommendationsMovieDate.innerText =
                data.release_date || data.last_air_date || "";
              recommendationsMovieName.innerText = data.title || data.name;
              recommendationsMovieTag.innerText = data.tagline || "";
              let genList = "";
              data.genres.forEach((element) => {
                genList += `${element.name} `;
              });
              recommendationsMovieGenres.innerText = genList || "";
            });
          }, 1050);
        }
      );
      document.querySelectorAll("#loadingTrigger")[0].onload = () => {
        recommendations.scrollIntoView({ behavior: "smooth", block: "center" });
      };
    },
    () => {
      const message = new bootstrap.Toast(toast);
      let i = 0;
      if (lang === "ru") i = 1;
      toastMsg.innerText = translate[i].data[5];
      message.show();
    }
  );
};
export const renderSearchResults = (query) => {
  searchEngine(
    "multi",
    query,
    1,
    (data) => {
      let inner = "";
      data.forEach((element) => {
        let id = element.id;
        let scoreColor = "#dc3545";
        let scoreWidth = "auto";
        if (element.vote_average > 5) scoreColor = "#fd7e14";
        if (element.vote_average > 7.5) scoreColor = "#13795b";
        if (element.vote_average) scoreWidth = "64px";
        let imgSrc = noImage;
        if (element.poster_path || element.profile_path) {
          imgSrc = `${imdbImageStore}/t/p/w500/${
            element.poster_path || element.profile_path
          }`;
        }
        inner += `
                <div class="card shadow-lg">
                    <a href="#show_|_${element.media_type || type}_|_${id}">
                        <img style="min-height: 365px;" src="${imgSrc}" class="card-img-top" alt="${
          element.original_title
        }">
                    </a>
                    <p class="score" style="background-color: ${scoreColor}; width: ${scoreWidth};">${
          element.vote_average || ""
        }</p>
                    <div class="card-body">
                        <h5 class="card-title">${
                          element.title || element.name
                        }</h5>
                    </div>
                </div>
            `;
      });
      container.innerHTML = inner + '<div style="width: 100%; height: 16px;"></div>';
      document.title = query;
    },
    () => {
      let i = 0;
      if (lang === "ru") i = 1;
      document.title = 404;
      container.innerHTML = `
            <section>
                <div class="container">
                    <div class="row gx-4 gx-lg-5 align-items-center">
                        <div class="col-md-6">
                            <img class="card-img-top mb-5 mb-md-0" src="${noContent}">
                        </div>
                        <div class="col-md-6">
                            <h1 class="display-5 fw-bolder">
                                404
                            </h1>
                            <div class="fs-5 mb-2">
                                <span id="itemTag">
                                    ${translate[i].data[7]}
                                </span>
                            </div>
                            <div class="fs-5 mb-2">
                                <button style="width: 128px;" type="button" class="btn btn-success m-0 p-0">
                                    <a class="m-0 p-1 nav-link text-light" aria-current="page" href="#trending_|_all_|_week_|_1">
                                        ${translate[i].data[8]}
                                    </a>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }
  );
};
export const renderTorrentLiveVideo = () => {
  container.innerHTML = `
    <div class="d-flex justify-content-center">
        <div style="color: #fff;" class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
  `;
  if (localStorage.getItem("search_api_server")) {
    sessionStorage.setItem("series_num", "");
    let seriesNum = "";
    if (sessionStorage.getItem("series_num")) {
      seriesNum = sessionStorage.getItem("series_num");
    }
    fetch(
      `${torrentSearchApi}/api/torrent/webtor?type=All&query=${
        window.location.href.split("_|_")[1] + seriesNum
      }`
    )
      .then((result) => {
        if (result.status === 200) return result.text();
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
        output.srcdoc = result;
        torrentPlayerTitle.innerText = decodeURI(
          window.location.href.split("_|_")[1]
        );
        let seasons = JSON.parse(sessionStorage.getItem("seasons"));
        if (seasons.length > 0) {
          let seasonsInner = "";
          let count = 1;
          let episodesArray = [];
          seasons.forEach((element) => {
            let episodesInner = "";
            seasonsInner += `
              <option value="${count}">${element.name}</option>
            `;
            for (let index = 1; index < element.qty; index++) {
              episodesInner += `
                <option value="${index}">${index}</option>
              `;
            }
            episodesArray.push({ season: count, episodes: episodesInner });
            count++;
          });
          console.log(episodesArray);
          container.innerHTML += `
            <select id="seasonsSelector"></select>
            <select id="episodesSelector"></select>
            <a id="seasonEpisodeShow">
              <button>Ok</button>
            </a>
          `;
          seasonsSelector.innerHTML = seasonsInner;
          episodesSelector.innerHTML = episodesArray[0].episodes;
          seasonsSelector.onchange = () => {
            episodesArray.innerHTML =
              episodesArray[seasonsSelector.value - 1].episodes;
            sessionStorage.setItem(
              "series_num",
              `S${seasonsSelector.value}E${episodesSelector.value}`
            );
          };
          episodesSelector.onchange = () => {
            sessionStorage.setItem(
              "series_num",
              `S${seasonsSelector.value}E${episodesSelector.value}`
            );
          };
          sessionStorage.setItem("series_num", "S01E01");
          seasonEpisodeShow.onclick = () => {
            if (sessionStorage.getItem("series_num")) {
              seriesNum = sessionStorage.getItem("series_num");
            }
            fetch(
              `${torrentSearchApi}/api/torrent/webtor?type=All&query=${
                window.location.href.split("_|_")[1] + seriesNum
              }`
            )
              .then((result) => {
                if (result.status === 200) return result.text();
                else {
                  const message = new bootstrap.Toast(toast);
                  let i = 0;
                  if (lang === "ru") i = 1;
                  toastMsg.innerText = result.status;
                  message.show();
                }
              })
              .then((result) => {
                output.srcdoc = result;
              });
          };
        }
      });
  } else {
    let i = 0;
    if (lang === "ru") i = 1;
    container.innerHTML = `
      <section>
        <div class="container">
            <div class="row gx-4 gx-lg-5 align-items-center">
                <div class="col-md-6">
                    <img class="card-img-top mb-5 mb-md-0" src="${noContent}">
                </div>
                <div class="col-md-6">
                    <h1 class="display-5 fw-bolder">
                        404
                    </h1>
                    <div class="fs-5 mb-2">
                        <span id="itemTag">
                            ${translate[i].data[19]}
                        </span>
                    </div>
                    <div class="fs-5 mb-2">
                        <button style="width: 128px;" type="button" class="btn btn-success m-0 p-0">
                            <a class="m-0 p-1 nav-link text-light" aria-current="page" href="#settings">
                                ${translate[i].data[22]}
                            </a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>
    `;
  }
};
// Nav links & tabs
export const renderTrendingCards = (type, time, page) => {
  container.innerHTML = `
        <div class="d-flex justify-content-center">
            <div style="color: #fff;" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
  getTrending(
    type,
    time,
    page,
    (data) => {
      let inner = "";
      data.forEach((element) => {
        let id = element.id;
        let scoreColor = "#dc3545";
        let scoreWidth = "auto";
        if (element.vote_average > 5) scoreColor = "#fd7e14";
        if (element.vote_average > 7.5) scoreColor = "#13795b";
        if (element.vote_average) scoreWidth = "82px";
        let imgSrc = noImage;
        if (element.poster_path || element.profile_path) {
          imgSrc = `${imdbImageStore}/t/p/w500/${
            element.poster_path || element.profile_path
          }`;
        }
        inner += `
                <div class="card shadow-lg">
                    <a href="#show_|_${element.media_type || type}_|_${id}">
                        <img style="min-height: 365px;" src="${imgSrc}" class="card-img-top" alt="${
          element.original_title
        }">
                    </a>
                    <p class="score" style="background-color: ${scoreColor}; width: ${scoreWidth};">${
          element.vote_average || ""
        }</p>
                    <div class="card-body">
                        <h5 class="card-title">${
                          element.title || element.name
                        }</h5>
                    </div>
                </div>
            `;
      });
      if (Number(page) < 1000) {
        inner += `
      <a style="width: 100%; text-align: center;" href="#trending_|_${type}_|_${time}_|_${
          Number(page) + 1
        }">
        <button style="background: #fff; border: none;"class=" mt-4 mb-4">
          <img src="${expandIco}" alt="expand">
        </button>
      </a>
    `;
      }
      else {
        inner += `<div style="width: 100%; height: 16px;"></div>`
      }
      container.innerHTML = inner;
      let i = 0;
      if (lang === "ru") i = 1;
      let docTitle = "";
      if (type === "movie") docTitle = document.title = translate[i].data[0];
      if (type === "tv") docTitle = document.title = translate[i].data[1];
      if (type === "person") docTitle = document.title = translate[i].data[3];
      if (type === "all") docTitle = document.title = translate[i].data[2];
      document.title = docTitle;
    },
    (error) => {
      const message = new bootstrap.Toast(toast);
      toastMsg.innerText = error;
      message.show();
      let i = 0;
      if (lang === "ru") i = 1;
      container.innerHTML = `
        <section>
          <div class="container">
              <div class="row gx-4 gx-lg-5 align-items-center">
                  <div class="col-md-6">
                      <img class="card-img-top mb-5 mb-md-0" src="${errorMsg}">
                  </div>
                  <div class="col-md-6">
                      <h1 class="display-5 fw-bolder">
                        ${translate[i].data[25]}
                      </h1>
                      <div class="fs-5 mb-2">
                          <span id="itemTag">
                              ${translate[i].data[24]}
                          </span>
                      </div>
                      <div class="fs-5 mb-2">
                          <button style="width: 128px;" type="button" class="btn btn-success m-0 p-0">
                              <a class="m-0 p-1 nav-link text-light" aria-current="page" href="#settings">
                                  ${translate[i].data[22]}
                              </a>
                          </button>
                      </div>
                  </div>
              </div>
          </div>
        </section>
      `;
    }
  );
};
export const renderNativeTorrentPlayer = () => {
  let i = 0;
  if (lang === "ru") i = 1;
  document.title = translate[i].data[10];
  container.innerHTML = `
        <section>
            <div class="container">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-5 fw-bolder">
                            ${translate[i].data[10]}
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${translate[i].data[11]}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-4 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <div id="output">
                            <div id="progressBar"></div>
                            <video id="outputVideo" controls></video>
                        </div>
                    </div>
                </div>
                <div>
                    <div>
                        <form id="webTorrentForm" class="mt-4 row align-items-center">
                            <div id="inputPlaceholder" class="col-md-12 mt-4">
                                <label for="inputPassword2" class="visually-hidden">Magnet URL</label>
                            </div>
                            <div class="col-md-12 mt-4">
                                <button style="width: 100%;" type="submit" class="btn btn-success">
                                    ${translate[i].data[12]}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
  let input = document.createElement("input");
  input.classList = "form-control";
  input.type = "file";
  input.id = "magnetUrl";
  let userAgent = window.navigator.userAgent;
  let iphoneIpad = false;
  input.accept = "application/x-bittorrent";
  if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
    iphoneIpad = true;
  }
  inputPlaceholder.appendChild(input);
  webTorrentForm.onsubmit = () => {
    event.preventDefault();

    const fileList = magnetUrl.files;
    function readFile(file) {
      if (
        iphoneIpad ||
        (file && file.type && file.type.startsWith("application/x-bittorrent"))
      ) {
        const reader = new FileReader();
        reader.addEventListener("load", (event) => {
          fetch(event.target.result)
            .then((res) => {
              return res.blob();
            })
            .then((blob) => {
              getTorrentByMagnet(blob);
            });
        });
        reader.readAsDataURL(file);
      } else {
        return;
      }
    }
    readFile(fileList[0]);
  };
  if (file) {
    file.renderTo("#outputVideo");
  }
};
export const renderWebTorPlayer = () => {
  let i = 0;
  if (lang === "ru") i = 1;
  document.title = translate[i].data[10];
  container.innerHTML = `
        <section>
            <div class="container px-4 px-lg-5 my-5">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-5 fw-bolder">
                            ${translate[i].data[10]}
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${translate[i].data[11]}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-4 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <iframe class="shadow-sm movieFrame" height="0px" style="background: #000000;" id="output" sandbox="allow-scripts allow-same-origin"></iframe>
                    </div>
                </div>
            </div>
        </section>
    `;
};
export const renderFavorites = (data) => {
  let i = 0;
  if (lang === "ru") i = 1;
  document.title = translate[i].data[13];
  container.innerHTML = `
        <section>
            <div class="container">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-5 fw-bolder">
                            ${translate[i].data[13]}
                        </h1>
                    </div>            
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <div class="table-wrap">
                            <table class="table">
                                <thead class="thead-primary">
                                    <tr>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                        <th>&nbsp;</th>
                                    </tr>
                                </thead>
                            <tbody id="favoritesInner">
                                <tr class="alert" role="alert">
                                    <td colspan="4">
                                        <h1 style="text-align: center; color: #fff;">
                                            ¯\\_(ツ)_/¯
                                        </h1>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    `;
  let inner = "";
  if (data) {
    if (JSON.parse(data).length > 0) {
      JSON.parse(data).forEach((element) => {
        inner += `
                    <tr class="alert" role="alert">
                        <td>
                            <div class="favoritesImg" style="background-image: url(${element.img_path});"></div>
                        </td>
                        <td>
                            <div>
                                <a href="#show_|_${element.type}_|_${element.id}">
                                    <span>${element.title}</span>
                                    <br>
                                    <span>${element.subtitle}</span>
                                </a>
                            </div>
                        </td>
                        <td>
                            <button id="${element.type}_${element.id}" type="button" class="delFavoriteBtn btn btn-danger">
                                <img class="ico" src="${deleteIco}">
                            </button>
                        </td>
                    </tr>
                `;
      });
      favoritesInner.innerHTML = inner;
      const delItem = (element) => {
        let params = element.id;
        let type = params.split("_")[0];
        let id = params.split("_")[1];
        let userData;
        if (localStorage.getItem("favorites")) {
          userData = JSON.parse(localStorage.getItem("favorites"));
          let netArray = [];
          userData.forEach((element) => {
            if (element.id + element.type == id + type) {
              return;
            } else {
              netArray.push(element);
            }
          });
          localStorage.setItem("favorites", JSON.stringify(netArray));
          window.location.reload();
        }
      };
      document.querySelectorAll(".delFavoriteBtn").forEach((element) => {
        element.onclick = () => {
          delItem(element);
        };
      });
    }
  }
};
export const renderSettingsTab = () => {
  let ip = "will be available on next app load";
  let dev = "will be available on next app load";
  let qty;
  let mem;
  var _lsTotal = 0,
    _xLen,
    _x;
  for (_x in localStorage) {
    if (!localStorage.hasOwnProperty(_x)) {
      continue;
    }
    _xLen = (localStorage[_x].length + _x.length) * 2;
    _lsTotal += _xLen;
  }
  mem = (_lsTotal / 1024).toFixed(2) + " Kb";
  let rtc = false;
  if (localStorage.getItem("user_data")) {
    ip = JSON.parse(localStorage.getItem("user_data")).ip;
    dev = JSON.parse(localStorage.getItem("user_data")).device;
  }
  if (localStorage.getItem("favorites")) {
    qty = JSON.parse(localStorage.getItem("favorites")).length;
  }
  let isWebRTCSupported =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia ||
    window.RTCPeerConnection;
  if (window.navigator.userAgent.indexOf("Edge") > -1) {
    rtc = false;
  }
  if (isWebRTCSupported) {
    rtc = true;
  } else {
    rtc = false;
  }
  let i = 0;
  if (lang === "ru") i = 1;
  document.title = translate[i].data[22];
  container.innerHTML = `
        <section>
            <div class="container">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-5 fw-bolder">
                            ${translate[i].data[17]}
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${translate[i].data[18]}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-5 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-7">
                            IP address
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${ip}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-7">
                            Device info
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${dev}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-7">
                            Items in favorites
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${qty}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-7">
                            Local storage cache size
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${mem}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-7">
                            Web RTC support
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${rtc}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="row gx-4 gx-lg-5 align-items-center mt-5 mb-5">
                    <div class="col-md-12">
                        <h1 id="torrentPlayerTitle" class="display-5 fw-bolder">
                            ${translate[i].data[22]}
                        </h1>
                        <div class="fs-5 mb-2">
                            <span id="torrentPlayerDescription">
                                ${translate[i].data[23]}
                            </span>
                        </div>
                    </div>            
                </div>
                <div class="form-check form-switch mb-4">
                  <input
                    class="form-check-input mt-2 mb-2"
                    type="checkbox"
                    role="switch"
                    id="webtorSwitch"
                  />
                  <label class="form-check-label m-1" for="webtorSwitch">
                    Use Torrent search API (experimental feature)
                  </label>
                </div>
                <div id="searchApiHostElement" class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <div class="fs-5 mb-2">
                            <div class="form-floating mb-3">
                                <input style="height: 64px;" id="searchApiHost" type="text" class="form-control" id="floatingInput" placeholder="Search API host">
                                <label for="floatingInput">Torrent search API</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="searchDomainInput" class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <div class="fs-5 mb-2">
                            <div class="form-floating mb-3">
                                <input style="height: 64px;" id="searchDomain" type="text" class="form-control" id="floatingInput" placeholder="Search API host">
                                <label for="searchSiteDomainInput">Search site domain</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="onlyVideoSearchDiv" class="form-check form-switch mb-4">
                  <input
                    class="form-check-input mt-2 mb-2"
                    type="checkbox"
                    role="switch"
                    id="onlyVideoSearch"
                  />
                  <label class="form-check-label m-1" for="onlyVideoSearch">
                    Only long video search
                  </label>
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <div class="fs-5 mb-2">
                            <div class="form-floating mb-3">
                                <input style="height: 64px;" id="imdbApiMirror" type="text" class="form-control" id="floatingInput" placeholder="Search API host">
                                <label for="floatingInput">IMDB API mirror</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <div class="fs-5 mb-2">
                            <div class="form-floating mb-3">
                                <input style="height: 64px;" id="imdbImagesMirror" type="text" class="form-control" id="floatingInput" placeholder="Search API host">
                                <label for="floatingInput">IMDB Images mirror</label>
                            </div>
                        </div>
                    </div>
                </div>
                <label for="uiScale" class="form-label">UI scale</label>
                <input type="range" class="form-range" min="0.5" max="1.5" step="0.1" id="uiScale">
                <div class="form-check form-switch mb-4">
                  <input
                    class="form-check-input mt-2 mb-2"
                    type="checkbox"
                    role="switch"
                    id="backgroundSwitch"
                  />
                  <label class="form-check-label m-1" for="backgroundSwitch">
                    Disable video background
                  </label>
                </div>
                <div class="mt-3 row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12">
                        <div class="fs-5 mb-2">
                          <button class="btn btn-secondary" id="saveServer">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
  if (localStorage.getItem("search_api_server")) {
    searchApiHost.value = localStorage.getItem("search_api_server");
  }
  if (localStorage.getItem("search_domain")) {
    searchDomain.value = localStorage.getItem("search_domain");
  }
  if (localStorage.getItem("imdb_api_server")) {
    imdbApiMirror.value = localStorage.getItem("imdb_api_server");
  }
  if (localStorage.getItem("imdb_images_server")) {
    imdbImagesMirror.value = localStorage.getItem("imdb_images_server");
  }
  if (
    localStorage.getItem("use_webtor") &&
    localStorage.getItem("use_webtor") == 1
  ) {
    webtorSwitch.checked = true;
    onlyVideoSearchDiv.hidden = true;
  }
  if (
    localStorage.getItem("long_videos") &&
    localStorage.getItem("long_videos") == 1
  ) {
    onlyVideoSearch.checked = true;
  }
  if (
    localStorage.getItem("videa_background") &&
    localStorage.getItem("videa_background") == 0
  ) {
    backgroundSwitch.checked = true;
    backgroundVideo.hidden = true;
  }
  if (localStorage.getItem("ui_scale")) {
    uiScale.value = localStorage.getItem("ui_scale");
  }
  webtorSwitch.onchange = () => {
    if (webtorSwitch.checked) {
      searchApiHostElement.hidden = false;
      searchDomainInput.hidden = true;
      onlyVideoSearchDiv.hidden = true;
    } else {
      searchApiHostElement.hidden = true;
      searchDomainInput.hidden = false;
      onlyVideoSearchDiv.hidden = false;
    }
  };
  saveServer.onclick = () => {
    localStorage.setItem("ui_scale", uiScale.value);
    if (backgroundSwitch.checked) {
      localStorage.setItem("videa_background", 0);
    } else {
      localStorage.setItem("videa_background", 1);
    }
    if (webtorSwitch.checked) {
      localStorage.setItem("use_webtor", 1);
    } else {
      localStorage.setItem("use_webtor", 0);
    }
    if (onlyVideoSearch.checked) {
      localStorage.setItem("long_videos", 1);
    } else {
      localStorage.setItem("long_videos", 0);
    }
    localStorage.setItem("search_api_server", searchApiHost.value);
    localStorage.setItem("imdb_api_server", imdbApiMirror.value);
    localStorage.setItem("imdb_images_server", imdbImagesMirror.value);
    localStorage.setItem("search_domain", searchDomain.value);
    window.location.reload();
  };
  if (!allowTorrents) {
    searchApiHostElement.hidden = true;
  } else {
    searchDomainInput.hidden = true;
  }
};
// html2canvas image render
const printDiv = (div) => {
  itemDescriptionForShare.style.backgroundColor = "#333";
  itemControllButtons.style = "display: none !important";
  html2canvas(div).then((canvas) => {
    let anchor = document.createElement("a");
    anchor.href = canvas.toDataURL("image/png");
    anchor.download = `${document.title}.png`;
    try {
      itemDescriptionForShare.style.backgroundColor = "";
      itemControllButtons.style = "";
      fetch(anchor.href)
        .then(result => {
          const file = new File([result.blob()], `${document.title}.png`, { type: "image/png" });
          navigator.share({
            title: document.title,
            text: window.location,
            files: [file],
          })
        })
        .catch(error => {
          const message = new bootstrap.Toast(toast);
          toastMsg.innerText = error;
          message.show();
          anchor.click();
        })
    } catch (error) {
      const message = new bootstrap.Toast(toast);
      toastMsg.innerText = error;
      message.show();
      anchor.click();
    }
  });
}
