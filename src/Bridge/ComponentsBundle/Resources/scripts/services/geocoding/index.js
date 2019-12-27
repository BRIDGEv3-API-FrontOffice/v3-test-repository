const GEOCODING_URL = 'https://nominatim.openstreetmap.org/reverse';

class GeocodingService {
    init(ajaxService) {
        this.ajaxService = ajaxService;
    }

    getGeocoding(position) {
        return this.reverseGeocoding(position)
            .then((data) => {
                return data;
            })
            .catch((error) => {
                return error;
            });
    }

    reverseGeocoding(position) {
        const url = GEOCODING_URL;
        const data = {
            format: 'json',
            zoom: 18,
            addressdetails: 1,
            lat: position.coords.latitude,
            lon: position.coords.longitude
        };
        const options = {
            method: 'GET',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json'
        };

        return this.ajaxService.callAjax(url, data, options)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                return error;
            });
    }
}

GeocodingService.deps = ['ajaxService'];

module.exports = GeocodingService;
