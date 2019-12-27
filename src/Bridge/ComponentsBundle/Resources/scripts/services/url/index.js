class UrlService {
    getUrlParameter(name) {
        return decodeURIComponent((new RegExp(`[?|&]${name}=([^&;]+?)(&|#|;|$)`).exec(this.getWindowLocationSearch()) || ['', ''])[1].replace(/\+/g, '%20')) || null;
    }

    getWindowLocationSearch() {
        return window.location.search;
    }

    /*eslint func-style: ["error", "declaration", { "allowArrowFunctions": true }]*/
    getMutipleUrlParameters(searchString) {
        const parseParameter = (params, pairs) => {
            const pair = pairs[0];
            const parts = pair.split('=');
            const key = decodeURIComponent(parts[0]);
            const value = decodeURIComponent(parts.slice(1).join('='));

            // Handle multiple parameters of the same name
            if (typeof params[key] === 'undefined') {
                params[key] = value;
            } else {
                params[key] = [].concat(params[key], value);
            }

            return pairs.length === 1 ? params : parseParameter(params, pairs.slice(1));
        };

        // Get rid of leading ?
        return searchString.length === 0 ? {} : parseParameter({}, searchString.substr(1).split('&'));
    }

    getParametersString(parameters) {
        return `?${parameters.join('&')}`;
    }
}

module.exports = UrlService;
