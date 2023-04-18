export const apiUrl = 'https://api.themoviedb.org'
export const apiKey = 'dcaf7f5ea224596464b7714bac28142f'

import ruIco from "../assets/ru.png"
import usaIco from "../assets/usa.png"

export let lang = 'en'
if (sessionStorage.getItem('lang') == 1) {
    lang = 'ru'
    langIcon.src = ruIco
    langSwitch.checked = true
} else {
    lang = 'en'
    langIcon.src = usaIco
    langSwitch.checked = false
}

export const translate = [
    {
        lang: 'en', 
        data: [
            'Top movies', 
            'Top TVs', 
            'Top Mixed', 
            'Top Persons', 
            'Search', 
            'No recommendations at this time', 
            'No trailers found',
            'Nothing was found on your query',
            'Home page',
            'No "wss://" support',
            'Web Torrent player',
            'Pre alpha feature',
            'Load'
        ]
    },
    {
        lang: 'ru', 
        data: [
            'Фильмы', 
            'Сериалы', 
            'Все вместе', 
            'Люди', 
            'Поиск', 
            'Рекомендаций ещё нет', 
            'Трейлеры не найдены',
            'По вашему запросу ничего не найдено',
            'На главную',
            'Нет поддержки "wss://"',
            'Web Torrent проигрыватель',
            'Тестовый режим',
            'Загрузить'
        ]
    }
]
