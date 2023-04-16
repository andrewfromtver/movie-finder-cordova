import { apiKey, apiUrl, lang } from './config'

// type = ['movie', 'tv', 'person', 'all']
// time = ['day', 'week']
// output = Array
export const getTrending = (type, time, callback = (data) => {console.log(data);}) => {
    fetch(`${apiUrl}/3/trending/${type}/${time}?api_key=${apiKey}&language=${lang}`)
        .then(value => {
            if(value.status !== 200){
                return Promise.reject(new Error('Internal API error.'));
            }
            return value.json();
        })
        .then(output => {
            if(output.results.length === 0){
                return Promise.reject(new Error('Empty API response.'));
            }
            callback(output.results);
        })
        .catch(e => {
            console.error(e);
        });
}

// type = ['movie', 'tv', 'person']
// id = Integer
// output = Object
export const getFullInfo = (type, id, callback = (data) => {console.log(data);}) => {
    fetch(`${apiUrl}/3/${type}/${id}?api_key=${apiKey}&language=${lang}`)
        .then(value => {
            if(value.status !== 200){
                return Promise.reject(new Error('Internal API error.'));
            }
            return value.json();
        })
        .then(output => {
            if(!output){
                return Promise.reject(new Error('Empty API response.'));
            }
            callback(output);
        })
        .catch(e => {
            console.error(e);
        });
}

// type = ['movie', 'tv']
// id = Integer
// page = Integer
// output = Array
export const getRecommendations = (type, id, page = 1, callback = (data) => {console.log(data);}) => {
    fetch(`${apiUrl}/3/${type}/${id}/recommendations?api_key=${apiKey}&language=${lang}&page=${page}`)
        .then(value => {
            if(value.status !== 200){
                return Promise.reject(new Error('Internal API error.'));
            }
            return value.json();
        })
        .then(output => {
            if(output.results.length === 0){
                return Promise.reject(new Error('Empty API response.'));
            }
            callback(output.results);
        })
        .catch(e => {
            console.error(e);
        });
}

// type = ['movie', 'tv']
// id = Integer
// page = Integer
// output = Array
export const getItemsByPerson = (type, id, page = 1, callback = (data) => {console.log(data);}) => {
    fetch(`${apiUrl}/3/discover/${type}?api_key=${apiKey}&language=${lang}&page=${page}&with_people=${id}&sort_by=popularity.desc`)
        .then(value => {
            if(value.status !== 200){
                return Promise.reject(new Error('Internal API error.'));
            }
            return value.json();
        })
        .then(output => {
            if(output.results.length === 0){
                return Promise.reject(new Error('Empty API response.'));
            }
            callback(output.results);
        })
        .catch(e => {
            console.error(e);
        });
}

// type = ['movie', 'tv', 'multi']
// query = String
// page = Integer
// output = Array
export const searchEngine = (type, query, page, callback = (data) => {console.log(data);}) => {
    fetch(`${apiUrl}/3/search/${type}?api_key=${apiKey}&language=${lang}&page=${page}&query=${query}&sort_by=popularity.desc`)
        .then(value => {
            if(value.status !== 200){
                return Promise.reject(new Error('Internal API error.'));
            }
            return value.json();
        })
        .then(output => {
            if(output.results.length === 0){
                return Promise.reject(new Error('Empty API response.'));
            }
            callback(output.results);
        })
        .catch(e => {
            console.error(e);
        });
}

// type = ['movie', 'tv']
// id = Integer
// output = Array
export const getTrailers = (type, id, callback = (data) => {console.log(data);}) => {
    fetch(`${apiUrl}/3/${type}/${id}/videos?api_key=${apiKey}&language=${lang}`)
        .then(value => {
            if(value.status !== 200){
                return Promise.reject(new Error('Internal API error.'));
            }
            return value.json();
        })
        .then(output => {
            if(output.results.length === 0){
                return Promise.reject(new Error('Empty API response.'));
            }
            callback(output.results);
        })
        .catch(e => {
            console.error(e);
        });
}
