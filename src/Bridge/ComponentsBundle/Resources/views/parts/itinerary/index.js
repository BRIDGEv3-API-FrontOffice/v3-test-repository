import Component from '@components/scripts/base/Component';

class Itinerary extends Component {
    init(geolocationService) {
        this.geolocationService = geolocationService;

        this.bindEvents();
    }

    bindEvents() {
        this.el.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick(event) {
        if (navigator.permissions) {
            event.preventDefault();
            this.el.classList.add('loading');

            navigator.permissions
                .query({ name: 'geolocation' })
                .then(permission => {
                    if (permission.state === 'granted') {
                        this.geolocationService.getCurrentPosition()
                            .then((position) => {
                                this.el.classList.remove('loading');

                                const fromAddress = `${position.coords.latitude},${position.coords.longitude}`;
                                const destAddress = this.el.getAttribute('data-lf-itinerary');
                                const url = `${this.attr.host}${this.attr.start_addr}${fromAddress}${this.attr.dest_addr}${destAddress}`;

                                window.open(url);
                            })
                            .catch(() => {
                                this.el.classList.remove('loading');

                                window.open(this.el.getAttribute('href'));
                            });
                    } else {
                        this.el.classList.remove('loading');

                        window.open(this.el.getAttribute('href'));
                    }
                });
        }
    }
}

Itinerary.deps = ['geolocationService'];

export default Itinerary;
