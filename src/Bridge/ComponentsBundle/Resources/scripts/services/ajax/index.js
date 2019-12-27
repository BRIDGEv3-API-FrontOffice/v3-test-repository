const objectAssign = require('object-assign');
const Ajax = require('simple-ajax');

if (typeof Promise === 'undefined') {
    require('promise/lib/rejection-tracking').enable();
    window.Promise = require('promise/lib/es6-extensions.js');
}

class AjaxService {
    constructor(options) {
        this.attr = options;
    }

    searchText(query, searchOptions = {}, requestOptions = {}) {
        const data = {
            query: query,
            options: searchOptions
        };

        const options = getOptions(requestOptions);
        options.contentType = 'application/json';

        return this.callAjax(`${this.attr.urls.searchText}.${requestOptions.dataType}`, data, options);
    }

    searchCoordinates(lat, lon, searchOptions = {}, requestOptions = {}) {
        const data = {
            latitude: lat,
            longitude: lon,
            options: searchOptions
        };

        const options = getOptions(requestOptions);
        options.contentType = 'application/json';

        return this.callAjax(`${this.attr.urls.searchCoordinates}.${options.dataType}`, data, options);
    }

    callAjax(url, data, options = {}) {
        const query = getOptions(options);

        query.url = url;
        query.data = query.contentType === 'application/json' ? JSON.stringify(data) : data;

        const ajax = new Ajax(query);
        ajax.send();

        // eslint-disable-next-line
        return new Promise((resolve, reject) => {
            ajax.on('complete', (response) => {
                resolve(response.target.response);
            });

            ajax.on('error', (response) => {
                reject(response.target.response);
            });
        });
    }
}

function getOptions(options) {
    return objectAssign({
        method: 'POST',
        dataType: 'json'
    }, options);
}

module.exports = AjaxService;

