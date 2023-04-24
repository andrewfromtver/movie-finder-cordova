import logo from "../assets/logo.jpeg"
import searchIco from "../assets/search.svg"
import menuIco from "../assets/menu.svg"
import homeIco from "../assets/home.svg"
import favoritesIco from "../assets/favorites.svg"
import settingsIco from "../assets/settings.svg"
import playIco from "../assets/play.svg"
import webtorIco from "../assets/webtor.png"

import { lang, translate } from "./config";

import { 
    renderTrendingCards, 
    renderItem, 
    renderSearchResults, 
    renderFavorites, 
    renderNativeTorrentPlayer, 
    renderWebTorPlayer, 
    renderSettingsTab 
} from './render'

let searchApiServer = ''
export let apiUrl = 'https://api.themoviedb.org'
export let imgHost = 'https://image.tmdb.org'


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
        renderItem(type, id)

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
        playerType === 'native' ? renderNativeTorrentPlayer() : renderWebTorPlayer()

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link active'
        favoritesLink.classList = 'nav-link'
        settingsLink.classList = 'nav-link'
        if (href.includes('play')) {
            if (localStorage.getItem('search_api_server')) {
                fetch(`${searchApiServer}/api/torrent-search?t=All&q=${sessionStorage.getItem('torrent_search')}`)
                    .then(result => {
                        if (result.status === 200) return result.json()
                        else {
                            const message = new bootstrap.Toast(toast);
                            let i = 0
                            if (lang === 'ru') i = 1
                            toastMsg.innerText = result.status
                            message.show();
                        }
                    })
                    .then(result => {
                        renderWebTorPlayer()
                        sessionStorage.setItem('player', 'webtorrent')
                        playerSwitch.checked = true
                        magnetUrl.value = result.result
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
                    })
            } else {
                const message = new bootstrap.Toast(toast);
                let i = 0
                if (lang === 'ru') i = 1
                toastMsg.innerText = translate[i].data[19]
                message.show();
            }
        }
    } else if (href.includes('favorites')) {
        renderFavorites(localStorage.getItem('favorites'))

        homeLink.classList = 'nav-link'
        randomfindmachineLink.classList = 'nav-link'
        favoritesLink.classList = 'nav-link active'
        settingsLink.classList = 'nav-link'
    } else if (href.includes('settings')) {
        renderSettingsTab()

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
    if (localStorage.getItem('search_api_server')) {
        searchApiServer = localStorage.getItem('search_api_server')
        apiUrl = localStorage.getItem('search_api_server')
        imgHost = localStorage.getItem('search_api_server')
    }
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
