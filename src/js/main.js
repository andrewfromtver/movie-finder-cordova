import "../scss/styles.scss";

import * as bootstrap from "bootstrap";

import logo from "../assets/logo.jpeg"
import noImage from "../assets/no-image.png"
import trailerIco from "../assets/trailer.svg"
import recommendationsIco from "../assets/recommendations.svg"
import searchIco from "../assets/search.svg"
import menuIco from "../assets/menu.svg"
import noContent from "../assets/404.gif"
import homeIco from "../assets/home.svg"
import favoritesIco from "../assets/favorites.svg"
import settingsIco from "../assets/settings.svg"
import playIco from "../assets/play.svg"
import deleteIco from "../assets/delete.svg"
import webtorIco from "../assets/webtor.png"

import { getTrending, getFullInfo, getRecommendations, getItemsByPerson, searchEngine, getTrailers} from './api'
import { lang, translate } from "./config";

import { file, getTorrentByMagnet } from "./torrent"

const renderTrendingCards = (type, time) => {
    container.innerHTML = `
        <div class="d-flex justify-content-center" style="margin-top: 40vh;">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `
    getTrending(type, time, (data) => {
        let inner = ''
        data.forEach(element => {
            let id = element.id
            let scoreColor = '#dc3545'
            let scoreWidth = 'auto'
            if (element.vote_average > 5) scoreColor = '#fd7e14'
            if (element.vote_average > 7.5) scoreColor = '#13795b'
            if (element.vote_average) scoreWidth = '64px'
            let imgSrc = noImage
            if (element.poster_path || element.profile_path) {
                imgSrc = `https://image.tmdb.org/t/p/w500/${element.poster_path || element.profile_path}`
            }
            inner += `
                <div class="card shadow-sm" style="max-width: 320px; width: calc(100% - 16px); margin: 48px 8px 0 8px;">
                    <a href="#show_${element.media_type || type}_${id}">
                        <img src="${imgSrc}" class="card-img-top" alt="${element.original_title}">
                    </a>
                    <p class="score" style="background-color: ${scoreColor}; width: ${scoreWidth};">${element.vote_average || ""}</p>
                    <div class="card-body">
                        <h5 class="card-title" style="text-align: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${element.title || element.name}</h5>
                    </div>
                </div>
            `
        });
        container.innerHTML = inner
    })
}

const showItem = (type, id) => {
    container.innerHTML = `
        <div class="d-flex justify-content-center" style="margin-top: 40vh;">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `
    getFullInfo(type, id, (data) => {
        let showButtonText = `<img class="ico" src="${recommendationsIco}">`
        let similarButton = '' 
        if (type !== 'person') {
            showButtonText = `<img class="ico" src="${trailerIco}">`
            similarButton = `
                <button id="showSimilar" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                    <i class="bi-cart-fill me-1"></i>
                    <img class="ico" src="${recommendationsIco}">
                </button>
                <button id="findTorrent" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                    <i class="bi-cart-fill me-1"></i>
                    <img class="ico" src="${playIco}">
                </button>
            `
        }
        let scoreColor = '#dc3545'
        let scorePadding = 'auto'
        if (data.vote_average > 5) scoreColor = '#fd7e14'
        if (data.vote_average > 7.5) scoreColor = '#13795b'
        if (data.vote_average || data.birthday) scorePadding = '8px'
        let genList = ''
        if (type !== 'person') data.genres.forEach(element => {
            genList += `${element.name} `
        });
        let imgSrc = noImage
            if (data.poster_path || data.profile_path) {
                imgSrc = `https://image.tmdb.org/t/p/w500/${data.poster_path || data.profile_path}`
            }
        let inner = `
            <section>
                <div class="container px-4 px-lg-5 my-5">
                    <div class="row gx-4 gx-lg-5 align-items-center">
                        <div class="col-md-6"><img id="itemImg"class="shadow-sm card-img-top mb-5 mb-md-0" src="${imgSrc}" alt="" /></div>
                        <div class="col-md-6">
                            <h1 id="itemTitle" class="display-5 fw-bolder">${data.title || data.name}</h1>
                            <div class="fs-5 mb-2">
                                <span id="itemTag">${data.tagline || ""}</span>
                            </div>
                            <div class="fs-5 mb-3">
                                <span style="color: #13795b;" class="fw-bolder" id="itemGenres">${genList || ""}</span>
                            </div>
                            <div class="fs-5 mb-4">
                                <span id="itemDate" style="padding: ${scorePadding}; color: #fff; background-color: ${scoreColor};">${data.vote_average || data.birthday || ""}</span>
                            </div>
                            <p class="lead">${data.overview || data.biography || ""}</p>
                            <div  style="color: #dc3545;" class="pb-4">${data.release_date || data.last_air_date || ""}</div>
                            <div class="d-flex">
                                <button id="showRecommendations" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                                    <i class="bi-cart-fill me-1"></i>
                                    ${showButtonText}
                                </button>
                                ${similarButton}
                                <button id="${data.id}" class="addToFavorites m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                                    <i class="bi-cart-fill me-1"></i>
                                    <img class="ico" src="${favoritesIco}">
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section style="width: 100%;" id="recommendations"></section>
            <section style="width: 100%;" id="trailers"></section>
        `
        container.innerHTML = inner
        showRecommendations.onclick = () => {
            setTimeout( () => { showRecommendations.hidden = true }, 500);
            renderAddons(type, id)
        }
        if (type !== 'person') {
            showSimilar.onclick = () => {
                setTimeout( () => { showSimilar.hidden = true }, 250);
                renderRecommendations(type, id)
            }
            findTorrent.onclick = () => {
                // to-do add API call to get magnet by title & store magnet in session storage
                // let magnetUrl = getMagnet(itemTitle.innerText)
                sessionStorage.setItem('torrent_search', itemTitle.innerText)
                playerSwitch.checked = true
                sessionStorage.setItem('player', 'webtorrent')
                window.location.hash = '#webtorrent_play'
            }
        }
        const addItemToFavorites = (id, type, tytle, subtytle, img) => {
            const message = new bootstrap.Toast(toast);
            let i = 0
            if (lang === 'ru') i = 1
            if (localStorage.getItem('favorites')) {
                let userData = JSON.parse(localStorage.getItem('favorites'))
                let newObj = {
                    id: id,
                    type: type,
                    title: tytle,
                    subtitle: subtytle,
                    img_path: img
                }
                let unique = true
                userData.forEach(element => {
                    if (element.id + element.type == id + type) {
                        unique = false
                    }
                });
                if (unique) {
                    userData.push(newObj)
                    localStorage.setItem('favorites', JSON.stringify(userData))
                    toastMsg.innerText = translate[i].data[14]
                } else {
                    toastMsg.innerText = translate[i].data[15]
                }
            } else {
                toastMsg.innerText = translate[i].data[16]
            }
            message.show();
        }
        document.querySelectorAll('.addToFavorites').forEach(element => {
            element.onclick = () => {
                let tag = itemTag.innerText
                if (window.location.href.split('_')[1] === 'person') tag = itemDate.innerText
                addItemToFavorites(
                    element.id,
                    window.location.href.split('_')[1],
                    itemTitle.innerText,
                    tag,
                    itemImg.src
                )
            }
        });
    })
}

const renderAddons = (type, id) => {
    if (['movie', 'tv', 'all'].includes(type)) getTrailers(type, id, (data) => {
        let inner = `
            <div class="container px-4 px-lg-5 my-5">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-12 accordion" id="accordionTrailers">
        `
        let counter = 1
        let showToggle = 'show'
        let showClasslist = 'accordion-button'
        data.reverse().slice(0, 5).forEach(element => {
            let noOfficialTrailers = true
            if (lang === 'en') noOfficialTrailers = element.official
            if (noOfficialTrailers) {
                if (counter !== 1) {
                    showToggle = ''
                    showClasslist = 'accordion-button collapsed'
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
                                <iframe sandbox="allow-scripts allow-same-origin" class="trailerIframe" src="https://www.youtube.com/embed/${element.key}" frameborder="0"></iframe>
                            </div>
                            </div>
                        </div>
                `
                counter ++
            }
        });
        inner += '</div></div></div>'
        trailers.innerHTML = inner
        wideScreenFrame()
        if (document.getElementById('panelsStayOpen-collapse-1')) {
            setTimeout( () => {document.getElementById('panelsStayOpen-collapse-1').scrollIntoView({ behavior: 'smooth', block: 'center'}) }, 250);
        }
    },
    () => {
        const message = new bootstrap.Toast(toast);
        let i = 0
        if (lang === 'ru') i = 1
        toastMsg.innerText = translate[i].data[6]
        message.show();
    })
    if (type === 'person') getItemsByPerson('movie', id, 1, (data) => {
        let recMovieId
        let counter = 0
        let itemState = ''
        let buttonsInner = ''
        let inner = `
            <div class="container px-4 px-lg-5 my-5">
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
        `
        data.forEach(element => {
            let id = element.id
            counter === 0 ? itemState = 'active' : itemState = ''
            if (counter === 0) recMovieId = id
            let imgSrc = noImage
            if (element.poster_path || element.profile_path) {
                imgSrc = `https://image.tmdb.org/t/p/w500/${element.poster_path || element.profile_path}`
            }
            inner += `
                <div id="${id}" class="carousel-item ${itemState} movierec" data-bs-interval="10000">
                <a href="#show_movie_${id}">
                    <img id="loadingTrigger" src="${imgSrc}" class="d-block w-100" alt="${element.original_title || element.name}">
                </a>
                <div class="carousel-caption d-none d-md-block">
                </div>
                </div>
            `
            buttonsInner += `
                <button type="button" data-bs-target="#carouselRecommendations" data-bs-slide-to="${counter}" class="active" aria-label="${element.original_title || element.name}"></button>  
            `
            counter ++
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
        `
        recommendations.innerHTML = inner
        indicatorsMovies.innerHTML = buttonsInner
        getFullInfo('movie', recMovieId, (data) => {
            recommendationsMovieDate.innerText = data.release_date || data.last_air_date || ""
            recommendationsMovieName.innerText = data.title || data.name
            recommendationsMovieTag.innerText = data.tagline || ""
            let genList = ''
            data.genres.forEach(element => {
                genList += `${element.name} `
            });
            recommendationsMovieGenres.innerText = genList || ""
        })
        recSwitchPrev.onclick = () => {
            setTimeout( () => {
            let id = document.querySelector(".movierec.active").id
            getFullInfo('movie', id, (data) => {
                recommendationsMovieDate.innerText = data.release_date || data.last_air_date || ""
                recommendationsMovieName.innerText = data.title || data.name
                recommendationsMovieTag.innerText = data.tagline || ""
                let genList = ''
                data.genres.forEach(element => {
                    genList += `${element.name} `
                });
                recommendationsMovieGenres.innerText = genList || ""
            }) }, 1050)
        }
        recSwitchNext.onclick = () => {
            setTimeout( () => {
            let id = document.querySelector(".movierec.active").id
            getFullInfo('movie', id, (data) => {
                recommendationsMovieDate.innerText = data.release_date || data.last_air_date || ""
                recommendationsMovieName.innerText = data.title || data.name
                recommendationsMovieTag.innerText = data.tagline || ""
                let genList = ''
                data.genres.forEach(element => {
                    genList += `${element.name} `
                });
                recommendationsMovieGenres.innerText = genList || ""
            }) }, 1050)
        }
        loadingTrigger[0].onload = () => { recommendations.scrollIntoView({ behavior: 'smooth', block: 'center'}) }  
    },
    () => {
        const message = new bootstrap.Toast(toast);
        let i = 0
        if (lang === 'ru') i = 1
        toastMsg.innerText = translate[i].data[5]
        message.show();
    },
    () => {
        const message = new bootstrap.Toast(toast);
        let i = 0
        if (lang === 'ru') i = 1
        toastMsg.innerText = translate[i].data[5]
        message.show();
    })
}

const renderRecommendations = (type, id) => {
    getRecommendations(type, id, 1, (data) => {
        let recMovieId
        let counter = 0
        let itemState = ''
        let buttonsInner = ''
        let inner = `
            <div class="container px-4 px-lg-5 my-5">
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
        `
        data.forEach(element => {
            let id = element.id
            counter === 0 ? itemState = 'active' : itemState = ''
            if (counter === 0) recMovieId = id
            let imgSrc = noImage
            if (element.poster_path || element.profile_path) {
                imgSrc = `https://image.tmdb.org/t/p/w500/${element.poster_path || element.profile_path}`
            }
            inner += `
                <div id="${id}" class="carousel-item ${itemState} movierec" data-bs-interval="10000">
                <a href="#show_${type}_${id}">
                    <img id="loadingTrigger" src="${imgSrc}" class="d-block w-100" alt="${element.original_title || element.name}">
                </a>
                <div class="carousel-caption d-none d-md-block">
                </div>
                </div>
            `
            buttonsInner += `
                <button type="button" data-bs-target="#carouselRecommendations" data-bs-slide-to="${counter}" class="active" aria-label="${element.original_title || element.name}"></button>  
            `
            counter ++
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
        `
        recommendations.innerHTML = inner
        indicatorsMovies.innerHTML = buttonsInner

        getFullInfo(type, recMovieId, (data) => {
            recommendationsMovieDate.innerText = data.release_date || data.last_air_date || ""
            recommendationsMovieName.innerText = data.title || data.name
            recommendationsMovieTag.innerText = data.tagline || ""
            let genList = ''
            data.genres.forEach(element => {
                genList += `${element.name} `
            });
            recommendationsMovieGenres.innerText = genList || ""
        })

        recSwitchPrev.onclick = () => {
            setTimeout( () => {
            let id = document.querySelector(".movierec.active").id
            getFullInfo(type, id, (data) => {
                recommendationsMovieDate.innerText = data.release_date || data.last_air_date || ""
                recommendationsMovieName.innerText = data.title || data.name
                recommendationsMovieTag.innerText = data.tagline || ""
                let genList = ''
                data.genres.forEach(element => {
                    genList += `${element.name} `
                });
                recommendationsMovieGenres.innerText = genList || ""
            }) }, 1050)
        }
        recSwitchNext.onclick = () => {
            setTimeout( () => {
            let id = document.querySelector(".movierec.active").id
            getFullInfo(type, id, (data) => {
                recommendationsMovieDate.innerText = data.release_date || data.last_air_date || ""
                recommendationsMovieName.innerText = data.title || data.name
                recommendationsMovieTag.innerText = data.tagline || ""
                let genList = ''
                data.genres.forEach(element => {
                    genList += `${element.name} `
                });
                recommendationsMovieGenres.innerText = genList || ""
            }) }, 1050)
        }
        loadingTrigger[0].onload = () => { 
            recommendations.scrollIntoView({ behavior: 'smooth', block: 'center'})
        }
    },
    () => {
        const message = new bootstrap.Toast(toast);
        let i = 0
        if (lang === 'ru') i = 1
        toastMsg.innerText = translate[i].data[5]
        message.show();
    })
}

const renderSearchResults = (query) => {
    searchEngine('multi', query, 1, (data) => {
        let inner = ''
        data.forEach(element => {
            let id = element.id
            let scoreColor = '#dc3545'
            let scoreWidth = 'auto'
            if (element.vote_average > 5) scoreColor = '#fd7e14'
            if (element.vote_average > 7.5) scoreColor = '#13795b'
            if (element.vote_average) scoreWidth = '64px'
            let imgSrc = noImage
            if (element.poster_path || element.profile_path) {
                imgSrc = `https://image.tmdb.org/t/p/w500/${element.poster_path || element.profile_path}`
            }
            inner += `
                <div class="card shadow-sm" style="max-width: 256px; width: calc(100% - 32px); margin: 48px 16px 0 16px;">
                    <a href="#show_${element.media_type || type}_${id}">
                        <img src="${imgSrc}" class="card-img-top" alt="${element.original_title}">
                    </a>
                    <p class="score" style="background-color: ${scoreColor}; width: ${scoreWidth};">${element.vote_average || ""}</p>
                    <div class="card-body">
                        <h5 class="card-title" style="text-align: center; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">${element.title || element.name}</h5>
                    </div>
                </div>
            `
        });
        container.innerHTML = inner
    },
    () => {
        let i = 0
        if (lang === 'ru') i = 1
        container.innerHTML = `
            <section>
                <div class="container px-4 px-lg-5 my-5">
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
    })
}

const renderFavorites = (data) => {
    let i = 0
    if (lang === 'ru') i = 1
    container.innerHTML = `
        <section>
            <div class="container px-4 px-lg-5 my-5">
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
                                        <h1 style="text-align: center;">
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
    `
    let inner = ''
    if (data) {
        if (JSON.parse(data).length > 0) {
            JSON.parse(data).forEach(element => {
                inner += `
                    <tr class="alert" role="alert">
                        <td>
                            <div class="favoritesImg" style="background-image: url(${element.img_path});"></div>
                        </td>
                        <td>
                            <div>
                                <a href="#show_${element.type}_${element.id}">
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
                `
            });
            favoritesInner.innerHTML = inner
            const delItem = (element) => {
                let params = element.id
                let type = params.split('_')[0]
                let id = params.split('_')[1]
                let userData
                if (localStorage.getItem('favorites')) {
                    userData = JSON.parse(localStorage.getItem('favorites'))
                    let netArray = []
                    userData.forEach(element => {
                        if (element.id + element.type == id + type) {
                            return
                        } else {
                            netArray.push(element)
                        }
                    });
                    localStorage.setItem('favorites', JSON.stringify(netArray))
                    window.location.reload()
                }
            }
            document.querySelectorAll('.delFavoriteBtn').forEach(element => {
                element.onclick = () => {
                    delItem(element)
                }
            });
        }
    }
}

const userData = (callbac = (data) => { console.log(data); }) => {
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
            callbac({ip: IpResult, device: DevResult});
        }
    };
}

const appUsageStat = () => {
    userData((data) => {
        localStorage.setItem('user_data', JSON.stringify(data))
    })
}

const webTorrentPlayer = () => {
    let i = 0
    if (lang === 'ru') i = 1
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
    `
    let input = document.createElement("input")
    input.classList = 'form-control'
    input.type = 'file'
    input.id = 'magnetUrl'
    let userAgent = window.navigator.userAgent;
    let iphoneIpad = false
    input.accept = ".torrent"
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i)) {
        iphoneIpad = true
    }
    inputPlaceholder.appendChild(input)
    webTorrentForm.onsubmit = () => {
        event.preventDefault()

        const fileList = magnetUrl.files;
        function readFile(file) {
            if (iphoneIpad || file && file.type && file.type.startsWith('application/x-bittorrent')) {
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    fetch(event.target.result)
                        .then(res => {
                            return res.blob()
                        })
                        .then(blob => {
                            getTorrentByMagnet(blob);
                        })
                });
                reader.readAsDataURL(file)
            } else {
                return;
            }
        }
        readFile(fileList[0])
    }
    if (file) {
        file.renderTo('#outputVideo')
    }
}

const settingsTab = () => {
    let ip = 'will be available on next app load'
    let dev = 'will be available on next app load'
    let qty
    let mem
    var _lsTotal = 0,
        _xLen, _x;
    for (_x in localStorage) {
        if (!localStorage.hasOwnProperty(_x)) {
            continue;
        }
        _xLen = ((localStorage[_x].length + _x.length) * 2);
        _lsTotal += _xLen;
        console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB")
    };
    mem = (_lsTotal / 1024).toFixed(2) + " Kb";
    let rtc = false
    if (localStorage.getItem('user_data')) {
        ip = JSON.parse(localStorage.getItem('user_data')).ip
        dev = JSON.parse(localStorage.getItem('user_data')).device
    }
    if (localStorage.getItem('favorites')) {
        qty = JSON.parse(localStorage.getItem('favorites')).length
    }
    let isWebRTCSupported = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        window.RTCPeerConnection;
    if (window.navigator.userAgent.indexOf("Edge") > -1) {
        rtc = false
    }
    if (isWebRTCSupported) {
        rtc = true
    }
    else {
        rtc = false
    }
    let i = 0
    if (lang === 'ru') i = 1
    container.innerHTML = `
        <section>
            <div class="container px-4 px-lg-5 my-5">
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
            </div>
        </section>
    `
}

const webTorPlayer = () => {
    let i = 0
    if (lang === 'ru') i = 1
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
                        <iframe class="shadow-sm" height="0px" style="background: #111;" id="output" sandbox="allow-scripts allow-same-origin"></iframe>
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
    `
    let input = document.createElement("input")
    input.classList = 'form-control'
    input.type = 'text'
    input.placeholder = 'Magnet URL'
    input.id = 'magnetUrl'
    inputPlaceholder.appendChild(input)

    webTorrentForm.onsubmit = () => {
        event.preventDefault()
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
        `
        output.srcdoc = htmlPage
        wideScreenFrame()
    }
    setTimeout( () => { wideScreenFrame() }, 500 )
}

const wideScreenFrame = () => {
    if (window.location.href.includes('webtorrent')) document.querySelectorAll('iframe').forEach(element => {
        element.style.height = Math.floor(element.contentWindow.document.documentElement.scrollWidth / 1.778) + 16 + 'px';
    });
}

const stateListener = () => {
    closeSideBarBtn.click()
    let href = window.location.href
    if (href.includes('trending')) {
        let type = href.split('_')[1]
        let time = href.split('_')[2]
        renderTrendingCards(type, time)

        homeLink.classList = 'nav-link active'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link'
    } else if (href.includes('show')) {
        let type = href.split('_')[1]
        let id = href.split('_')[2]
        showItem(type, id)

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link'
    } else if (href.includes('search')) {
        let query = href.split('_')[1]
        renderSearchResults(query)

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link'
    } else if (href.includes('webtorrent')) {
        let playerType = 'native'
        if (sessionStorage.getItem('player')) playerType = sessionStorage.getItem('player')
        playerType === 'native' ? webTorrentPlayer() : webTorPlayer()

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link active'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link'
        if (href.includes('play')) {
            // if (magnetUrl && magnetUrl.type === 'text') magnetUrl.value = sessionStorage.getItem('torrent_search')
            // let htmlPage = `
            //     <!doctype html>
            //     <html>
            //         <head>
            //             <title>Webtor Player SDK Example</title>
            //             <meta charset="utf-8">
            //             <meta content="width=device-width, initial-scale=1" name="viewport">
            //             <meta content="ie=edge" http-equiv="x-ua-compatible">
            //             <style>
            //                 html, body, iframe {
            //                     margin: 0;
            //                     padding: 0;
            //                     width: 100%;
            //                     height: 100%;
            //                 }
            //             </style>
            //             <script src="https://cdn.jsdelivr.net/npm/@webtor/embed-sdk-js/dist/index.min.js" charset="utf-8" async></script>
            //         </head>
            //         <body>
            //             <video controls src="${magnetUrl.value}"></video>
            //         </body>
            //     </html>
            // `
            // if (output) output.srcdoc = htmlPage
            // wideScreenFrame()
            alert('Backend for this feature cannot be implemented on Github Pages, please wait for official release.')
        }
    } else if (href.includes('favorites')) {
        renderFavorites(localStorage.getItem('favorites'))

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link active'
        settingsLink.classList = 'nav-link'
    } else if (href.includes('settings')) {
        settingsTab()

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link active'
    } else {

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link'
    }
}

window.onload = () => {
    window.addEventListener("resize", () => {wideScreenFrame();});
    if (localStorage.getItem('favorites')) {
        appUsageStat()
    } else {
        localStorage.setItem('favorites', '[]')
    }
    let i = 0
    if (lang === 'ru') i = 1
    home.src = homeIco
    play.src = playIco
    favorites.src = favoritesIco
    playerIcon.src = webtorIco
    settings.src = settingsIco
    movies.innerText = translate[i].data[0]
    tvs.innerText = translate[i].data[1]
    mixed.innerText = translate[i].data[2]
    persons.innerText = translate[i].data[3]
    queryString.placeholder = translate[i].data[4]
    menuImg.src = menuIco
    searchImg.src = searchIco
    brand.src = logo
    window.addEventListener('popstate', stateListener);
    stateListener()
    searchForm.onsubmit = () => {
        event.preventDefault()
        window.location.href = `#search_${queryString.value}`
    }
    langSwitch.onchange = () => {
        langSwitch.checked ? sessionStorage.setItem('lang', 1) : sessionStorage.setItem('lang', 0)
        window.location.reload()
    }
    playerSwitch.onchange = () => {
        !playerSwitch.checked ? sessionStorage.setItem('player', 'native') : sessionStorage.setItem('player', 'webtorrent')
        window.location.reload()
    }
    if (sessionStorage.getItem('player') && sessionStorage.getItem('player') === 'webtorrent') {
        playerSwitch.checked = true
    } else {
        playerSwitch.checked = false
    }
    app.hidden = false
}
