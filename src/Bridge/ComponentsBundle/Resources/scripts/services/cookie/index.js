import Cookies from 'js-cookie/src/js.cookie.js';

const objectAssign = require('object-assign');

class CookieService {
    create(name, value, opt = {}) {
        const options = objectAssign({
            expires: 365,
            path: '/'
        }, opt);

        return Cookies.set(name, value, options);
    }

    read(name, isJson = false) {
        if(isJson) {
            return Cookies.getJSON(name);
        }

        return Cookies.get(name);
    }

    remove(name, opt = {}) {
        const options = objectAssign({
            path: '/'
        }, opt);

        return Cookies.remove(name, options);
    }
}

module.exports = CookieService;
