import Component from '@components/scripts/base/Component';

class Infowindow extends Component {
    init(eventEmitterService, ajaxService) {
        this.emitter = eventEmitterService;
        this.ajaxService = ajaxService;

        this.mapContainer = document.querySelector('[data-lf-map]');
        this.loader = this.mapContainer.querySelector('[data-lf-loader]');

        this.bindEvents();
    }

    bindEvents() {
        this.emitter.on('components.infowindow.getInfowindow', this.getInfowindow.bind(this));

        this.el.addEventListener('click', this.closeInfowindow.bind(this));
    }

    getInfowindow(location) {
        if (location) {
            this.el.innerHTML = null;
            this.loader.classList.add('active');
            this.mapContainer.classList.add('infowindow-active');
            this.ajaxService.callAjax(this.attr.infowindowUrl, location, {
                dataType: 'html',
                contentType: 'application/json'
            }).then(response => {
                this.loader.classList.remove('active');
                this.openInfowindow(response);
            });
        }
    }

    openInfowindow(content) {
        if (content === '') {
            const noContent = '<div class="lf-map-infowindow"><div class="lf-map-infowindow__content">' + this.el.getAttribute('data-lf-infowindow-msg') + '</div></div>';
            this.el.innerHTML = noContent;
        } else {
            this.el.innerHTML = content;
        }
    }

    closeInfowindow(e) {
        const actionButton = this.el.querySelector('[data-lf-location-button]');
        if (actionButton) {
            if (!actionButton.contains(e.target)) {
                this.mapContainer.classList.remove('infowindow-active');
            }
        } else {
            this.mapContainer.classList.remove('infowindow-active');
        }
    }
}

Infowindow.deps = ['eventEmitterService', 'ajaxService'];

export default Infowindow;
