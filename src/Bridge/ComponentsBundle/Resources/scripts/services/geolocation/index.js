if (typeof Promise === 'undefined') {
    require('promise/lib/rejection-tracking').enable();
    window.Promise = require('promise/lib/es6-extensions.js');
}

class GeolocationService {
    getCurrentPosition() {
        // eslint-disable-next-line
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    maximumAge: 60000,
                    timeout: 20000,
                    enableHighAccuracy: true
                });
            } else {
                reject(
                    new Error()
                );
            }
        });
    }
}

module.exports = GeolocationService;
