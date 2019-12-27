import Component from '@components/scripts/base/Component';
import {mobile} from '@components/scripts/utils/mobile';

class MapInteraction extends Component {
    init(eventEmitterService) {
        this.emitter = eventEmitterService;

        this.windowScroll = 0;
        this.isScrolling = null;

        this.map = document.querySelector('[data-lf-map]');
        this.results = document.querySelector('[data-lf-results]');
        this.resultsLength = parseInt(document.querySelector('[data-lf-results-length]').getAttribute('data-lf-results-length'));
        this.list = document.querySelector('[data-lf-list]');
        this.items = this.list ? this.list.querySelectorAll('[data-lf-location]') : [];
        this.toggler = document.querySelector('[data-lf-map-toggler]');

        if (this.resultsLength <= 0) {
            return;
        }

        this.delay = 250;
        this.overlay = 300;

        if (this.map && this.results && this.list && this.toggler) {
            this.bindEvents();
        } else {
            throw new Error('All elements are not implemented on the page');
        }
    }

    bindEvents() {
        this.emitter.on('modules.mapInteraction.focusOnLocation', this.focusOnLocation.bind(this));

        this.toggler.addEventListener('click', this.toggleMap.bind(this));

        if (mobile()) {
            this.results.addEventListener('touchmove', this.onResultsTouchMove.bind(this));
            this.results.addEventListener('touchend', this.onResultsTouchEnd.bind(this));
        } else {
            [].forEach.call(this.items, item => {
                item.addEventListener('mouseenter', this.handleLocationHover.bind(this));
                item.addEventListener('mouseleave', this.handleLocationHover.bind(this));
            });
        }
    }

    handleLocationHover(event) {
        const id = event.target.getAttribute('data-lf-location');
        switch (event.type) {
            case 'mouseenter':
                this.emitter.emit('components.map.setMarkerStatus', id, 'hover');
                break;

            case 'mouseleave':
                this.emitter.emit('components.map.setMarkerStatus', id, 'default');
                break;

            default:
                break;
        }
    }

    focusOnLocation(id) {
        this.emitter.emit('components.map.focusOnMarker', id);

        this.setWindowScroll();
        this.highLightLocation(id);
    }

    toggleMap() {
        if (this.map.classList.contains('map-active')) {
            this.hideMap();
            this.getWindowScroll();
        } else {
            this.setWindowScroll();
            this.showMap();
        }
    }

    onResultsTouchMove() {
        if (this.results.classList.contains('list-active') && !this.results.classList.contains('scroll-event')) {
            this.results.addEventListener('scroll', this.onResultsScroll.bind(this));
            this.results.classList.add('scroll-event');
        }
    }

    onResultsTouchEnd() {
        if (this.results.classList.contains('list-active')) {
            this.results.removeEventListener('scroll', this.onResultsScroll.bind(this));
            this.results.classList.remove('scroll-event');
        }
    }

    getLocationElement(id) {
        const element = this.list.querySelector(`[data-lf-location="${id}"]`);

        if (!element) {
            throw new Error(`No location with id: ${id}`);
        }

        return element;
    }

    highLightLocation(id) {
        const item = this.getLocationElement(id);
        item.classList.add('active');

        if (mobile()) {
            if (this.results.classList.contains('list-active')) {
                this.showList(id);
            } else {
                this.showMap();
                this.showList(id);
            }
        } else {
            this.scrollToLocation(id);
        }
    }

    scrollToLocation(id) {
        const item = this.getLocationElement(id);

        if (mobile()) {
            setTimeout(() => {
                this.results.scrollTo(item.offsetLeft - this.results.offsetWidth * 0.1, 0); // eslint-disable-line no-magic-numbers
            }, this.delay);
        } else {
            this.results.scrollTo(0, item.offsetTop);
        }
    }

    setWindowScroll() {
        this.windowScroll = window.scrollY > 0 ? window.scrollY : this.windowScroll;
    }

    getWindowScroll() {
        window.scrollTo(0, this.windowScroll);
    }

    showMap() {
        this.setMapState('map');
        this.setTogglerState('map');
        this.setResultsState('map');
    }

    hideMap() {
        this.setResultsState('default');
        this.setTogglerState('default');
        this.setMapState('default');
    }

    showList(id) {
        this.setTogglerState('list');
        this.setResultsState('list');
        this.scrollToLocation(id);
    }

    hideList() {
        this.setResultsState('map');
        this.setTogglerState('map');
    }

    setMapState(state = 'default') {
        switch (state) {
            case 'map':
                this.map.classList.add('map-active');
                break;

            default:
                this.map.classList.remove('map-active');
                break;
        }
    }

    setResultsState(state = 'default') {
        switch (state) {
            case 'map':
                this.results.classList.add('map-active');
                this.results.classList.remove('list-active');
                break;

            case 'list':
                this.results.classList.add('map-active');
                setTimeout(() => {
                    this.results.classList.add('list-active');
                    this.setLocationsWidth(true);
                }, this.delay);
                break;

            default:
                this.results.classList.remove('map-active');
                this.results.classList.remove('list-active');
                this.setLocationsWidth(false);
                break;
        }
    }

    setTogglerState(state = 'default') {
        switch (state) {
            case 'map':
                this.toggler.classList.add('map-active');
                this.toggler.style.bottom = 0;
                break;

            case 'list':
                this.toggler.classList.add('map-active');
                setTimeout(() => {
                    this.toggler.style.bottom = `${this.results.clientHeight}px`;
                }, this.overlay);
                break;

            default:
                this.toggler.classList.remove('map-active');
                this.toggler.style.bottom = 0;
                break;
        }
    }

    setLocationsWidth(isSet) {
        [].forEach.call(this.items, item => {
            item.style.width = isSet ? `${this.results.offsetWidth * 0.8}px` : null; // eslint-disable-line no-magic-numbers
        });
    }

    onResultsScroll() {
        window.clearTimeout(this.isScrolling);
        this.isScrolling = setTimeout(() => {
            const itemsOffset = [];
            [].forEach.call(this.items, item => {
                itemsOffset.push({
                    id: item.getAttribute('data-lf-location'),
                    offset: item.offsetLeft,
                    delta: Math.abs(this.results.scrollLeft - item.offsetLeft)
                });
            });

            itemsOffset.sort((a, b) => {
                return a.delta - b.delta;
            });

            this.scrollToLocation(itemsOffset[0].id);
            this.emitter.emit('components.map.focusOnMarker', itemsOffset[0].id);
        }, 66); // eslint-disable-line no-magic-numbers
    }
}

MapInteraction.deps = ['eventEmitterService'];

export default MapInteraction;
