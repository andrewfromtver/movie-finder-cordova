// Assets
import ruIco from "../assets/ru.png";
import usaIco from "../assets/usa.png";

// Lang
export let lang = "en";

// Read lang settings
if (sessionStorage.getItem("lang") == 1) {
  lang = "ru";
  langIcon.src = ruIco;
  langSwitch.checked = true;
} else {
  lang = "en";
  langIcon.src = usaIco;
  langSwitch.checked = false;
}

// Translations 0 - en, 1 - ru
export const translate = [
  {
    lang: "en",
    data: [
      "Top movies",
      "Top TVs",
      "Top Mixed",
      "Top Persons",
      "Search",
      "No recommendations at this time",
      "No trailers found",
      "Nothing was found on your query",
      "Home page",
      'No "wss://" support',
      "Web Torrent player",
      "Pre alpha feature",
      "Load",
      "Favorites",
      'Item added to "Favorites" list',
      'Item already exists in "Favorites" list',
      "An error occurred, try again later",
      "Metrics",
      "We do not collect your data",
      "Please setup search API server first",
      "Seasons",
      "Series",
    ],
  },
  {
    lang: "ru",
    data: [
      "Фильмы",
      "Сериалы",
      "Все вместе",
      "Люди",
      "Поиск",
      "Рекомендаций ещё нет",
      "Трейлеры не найдены",
      "По вашему запросу ничего не найдено",
      "На главную",
      'Нет поддержки "wss://"',
      "Web Torrent проигрыватель",
      "Тестовый режим",
      "Загрузить",
      "Избранное",
      "Элемент добавлен в избранное",
      "Элемент уже в избранном",
      "Произошла ошибка, попробуйте позже",
      "Метрики",
      "Мы не собираем ваши данные",
      "Search API сервер не настроен",
      "Сезоны",
      "Кол-во серий",
    ],
  },
];
