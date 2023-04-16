import "../scss/styles.scss";

import * as bootstrap from "bootstrap";

import logo from "../assets/logo.jpeg"
import noImage from "../assets/no-image.png"
import trailerIco from "../assets/trailer.svg"
import recommendationsIco from "../assets/recommendations.svg"
import searchIco from "../assets/search.svg"
import menuIco from "../assets/menu.svg"

import { getTrending, getFullInfo, getRecommendations, getItemsByPerson, searchEngine, getTrailers} from './api'
import { lang, translate } from "./config";

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
            `
        }
        let scoreColor = '#dc3545'
        let scoreWidth = 'auto'
        if (data.vote_average > 5) scoreColor = '#fd7e14'
        if (data.vote_average > 7.5) scoreColor = '#13795b'
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
                        <div class="col-md-6"><img class="shadow-sm card-img-top mb-5 mb-md-0" src="${imgSrc}" alt="" /></div>
                        <div class="col-md-6">
                            <div class="small mb-1">IMDB ID: ${data.imdb_id || " - "}</div>
                            <h1 class="display-5 fw-bolder">${data.title || data.name}</h1>
                            <div class="fs-5 mb-2">
                                <span id="itemTag">${data.tagline || ""}</span>
                            </div>
                            <div class="fs-5 mb-3">
                                <span style="color: #13795b;" class="fw-bolder" id="itemGenres">${genList || ""}</span>
                            </div>
                            <div class="fs-5 mb-3">
                                <span style="padding: 8px; color: #fff; background-color: ${scoreColor}; width: ${scoreWidth};">${data.vote_average || data.birthday}</span>
                            </div>
                            <p class="lead">${data.overview || data.biography || ""}</p>
                            <div class="d-flex">
                                <button id="showRecommendations" class="m-2 p-2 btn btn-secondary flex-shrink-0" type="button">
                                    <i class="bi-cart-fill me-1"></i>
                                    ${showButtonText}
                                </button>
                                ${similarButton}
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
        }
    })
}

const stateListener = () => {
    let href = window.location.href
    if (href.includes('trending')) {
        let type = href.split('_')[1]
        let time = href.split('_')[2]
        renderTrendingCards(type, time)
    } else if (href.includes('show')) {
        let type = href.split('_')[1]
        let id = href.split('_')[2]
        showItem(type, id)
    }
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
        data.forEach(element => {
            if (true) { //element.official
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
                            <div style="margin-bottom: 56px;">
                                <iframe src="https://www.youtube.com/embed/${element.key}" frameborder="0"></iframe>
                            </div>
                            </div>
                        </div>
                `
                counter ++
            }
        });
        inner += '</div></div></div>'
        trailers.innerHTML = inner
        if (document.getElementById('panelsStayOpen-collapse-1')) {
            setTimeout( () => {document.getElementById('panelsStayOpen-collapse-1').scrollIntoView({ behavior: 'smooth', block: 'center'}) }, 250);
        }
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
                        <div id="recommendationsMovieId" class="small mb-1"></div>
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
            recommendationsMovieId.innerText = `IMDB ID: ${data.imdb_id || " --- "}`
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
                recommendationsMovieId.innerText = `IMDB ID: ${data.imdb_id || " --- "}`
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
                recommendationsMovieId.innerText = `IMDB ID: ${data.imdb_id || " --- "}`
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
                        <div id="recommendationsMovieId" class="small mb-1"></div>
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
            recommendationsMovieId.innerText = `IMDB ID: ${data.imdb_id || " --- "}`
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
                recommendationsMovieId.innerText = `IMDB ID: ${data.imdb_id || " --- "}`
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
                recommendationsMovieId.innerText = `IMDB ID: ${data.imdb_id || " --- "}`
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
    })
}

window.onload = () => {
    let i = 0
    if (lang === 'ru') i = 1
    movies.innerText = translate[i].data[0]
    tvs.innerText = translate[i].data[1]
    mixed.innerText = translate[i].data[2]
    persons.innerText = translate[i].data[3]
    menuImg.src = menuIco
    searchImg.src = searchIco
    brand.src = logo
    window.addEventListener('popstate', stateListener);
    stateListener()
    searchForm.onsubmit = () => {
        event.preventDefault()
        renderSearchResults(queryString.value)
    }
}
