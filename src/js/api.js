// App imports
import { lang } from "./lang";
import { imdbApi, apiKey } from "./main";

// type = ['movie', 'tv', 'person', 'all']
// time = ['day', 'week']
// page = Integer
// output = Array
export const getTrending = (
  type,
  time,
  page = 1,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(
    `${imdbApi}/3/trending/${type}/${time}?${apiKey}&language=${lang}&page=${page}`
  )
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      if (output.results.length === 0) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output.results);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
// type = ['movie', 'tv', 'person']
// id = Integer
// output = Object
export const getFullInfo = (
  type,
  id,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(`${imdbApi}/3/${type}/${id}?${apiKey}&language=${lang}`)
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      if (!output) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
// type = ['movie', 'tv']
// id = Integer
// page = Integer
// output = Array
export const getRecommendations = (
  type,
  id,
  page = 1,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(
    `${imdbApi}/3/${type}/${id}/recommendations?${apiKey}&language=${lang}&page=${page}`
  )
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      if (output.results.length === 0) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output.results);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
// type = ['movie', 'tv']
// id = Integer
// page = Integer
// output = Array
export const getItemsByPerson = (
  type,
  id,
  page = 1,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(
    `${imdbApi}/3/discover/${type}?${apiKey}&language=${lang}&page=${page}&with_people=${id}&sort_by=popularity.desc`
  )
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      if (output.results.length === 0) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output.results);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
// type = ['movie', 'tv', 'multi']
// query = String
// page = Integer
// output = Array
export const searchEngine = (
  type,
  query,
  page,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(
    `${imdbApi}/3/search/${type}?${apiKey}&language=${lang}&page=${page}&query=${query}&sort_by=popularity.desc`
  )
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      if (output.results.length === 0) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output.results);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
// type = ['movie', 'tv']
// id = Integer
// output = Array
export const getTrailers = (
  type,
  id,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(`${imdbApi}/3/${type}/${id}/videos?${apiKey}&language=${lang}`)
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      if (output.results.length === 0) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output.results);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
// type = ['movie', 'tv']
// id = Integer
// output = Array
export const getCredits = (
  type,
  id,
  callback = (data) => {},
  errorHandler = (errorMsg) => {}
) => {
  fetch(`${imdbApi}/3/${type}/${id}/credits?${apiKey}&language=${lang}`)
    .then((value) => {
      if (value.status !== 200) {
        errorHandler(value);
        return Promise.reject(new Error("Internal API error."));
      }
      return value.json();
    })
    .then((output) => {
      console.log(output);
      if (output.results.length === 0) {
        errorHandler("Empty API response.");
        return Promise.reject(new Error("Empty API response."));
      }
      callback(output.results);
    })
    .catch((e) => {
      errorHandler(e);
    });
};
