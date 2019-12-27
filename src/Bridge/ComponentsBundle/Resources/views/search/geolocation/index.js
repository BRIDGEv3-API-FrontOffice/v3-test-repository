import Component from '@components/scripts/base/Component';

class GeolocationSearch extends Component {
    init(geolocationService, geocodingService, notificationService) {
        this.notification = notificationService;
        this.geolocationService = geolocationService;
        this.geocodingService = geocodingService;

        this.searchForm = document.querySelector('[data-lf-search-form]');

        if (this.searchForm) {
            this.inputQuery = this.searchForm.querySelector('[data-lf-search-query]');
            this.inputLat = this.searchForm.querySelector('[data-lf-search-latitude]');
            this.inputLon = this.searchForm.querySelector('[data-lf-search-longitude]');
            this.inputGeo = this.searchForm.querySelector('[data-lf-search-geo]');
            this.inputGeoStatus = document.querySelector('[data-lf-search-geolocation-status]');

            if (this.inputQuery && this.inputLat && this.inputLon && this.inputGeoStatus && this.inputGeo) {
                this.bindEvents();
            }
        }
    }

    bindEvents() {
        this.el.addEventListener('click', this.triggerGeolocationSearch.bind(this));
    }

    triggerGeolocationSearch(event) {
        event.preventDefault();

        this.el.classList.add('loading');

        this.geolocationService.getCurrentPosition()
            .then(position => {
                if (this.attr.useGeocoding) {
                    this.geocodingService.getGeocoding(position)
                        .then(response => {
                            const data = JSON.parse(response);
                            if (Object.keys(data).length && 'undefined' !== typeof data.address) {
                                const city = data.address.village || data.address.town || data.address.city;
                                this.inputQuery.value = city;
                                this.setSearchParameters(position);
                            }
                        })
                        .catch(() => {
                            this.inputQuery.value = '';
                            this.setSearchParameters(position);
                        });
                } else {
                    this.inputQuery.value = '';
                    this.setSearchParameters(position);
                }
            })
            .catch(error => {
                this.el.classList.remove('loading');

                this.inputGeoStatus.setAttribute('data-lf-search-geolocation-status', false);
                const title = this.el.getAttribute('data-lf-msg-title');
                let message = '';

                /* eslint no-magic-numbers: ["error", { "ignore": [1, 2, 3] }] */
                switch (error.code) {
                    case 1:
                        message = this.el.getAttribute('data-lf-msg-warning');
                        this.notification.display(title, message, 'warning');
                        break;
                    case 2:
                        message = this.el.getAttribute('data-lf-msg-error');
                        this.notification.display(title, message, 'error');
                        break;
                    case 3:
                        message = this.el.getAttribute('data-lf-msg-timeout');
                        this.notification.display(title, message, 'error');
                        break;
                    default:
                        break;
                }
            });
    }

    setSearchParameters(position) {
        this.inputLon.value = position.coords.longitude;
        this.inputLat.value = position.coords.latitude;
        this.inputGeoStatus.setAttribute('data-lf-search-geolocation-status', true);
        this.inputGeo.value = true;
        this.searchForm.submit();
    }
}

GeolocationSearch.deps = ['geolocationService', 'geocodingService', 'notificationService'];

export default GeolocationSearch;
