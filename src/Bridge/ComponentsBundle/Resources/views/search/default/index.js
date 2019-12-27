import Component from '@components/scripts/base/Component';

class SearchDefault extends Component {
    init(eventEmitterService) {
        this.emitter = eventEmitterService;

        this.overlay = document.querySelector('[data-lf-overlay]');
        this.inputQuery = this.el.querySelector('[data-lf-search-query]');
        this.filtersButton = this.el.querySelector('[data-lf-search-filters-button]');
        this.overlayBack = this.el.querySelector('[data-lf-search-overlay-button]');
        this.searchWrapper = document.querySelector('[data-lf-search-wrapper]');
        this.geoSubmit = document.querySelector('[data-lf-geolocation-button]');
        this.overlayGeoSubmit = document.querySelector('[data-lf-overlay-geolocation-submit]');
        this.buttonFiltersReset = this.el.querySelector('[data-lf-button-filters-reset]');

        this.bindEvents();
    }

    bindEvents() {
        if (this.inputQuery) {
            this.inputQuery.addEventListener('focus', this.showOverlay.bind(this));
            this.overlayBack.addEventListener('click', this.hideOverlay.bind(this));
        }

        if (this.filtersButton) {
            this.filtersButton.addEventListener('click', this.openFilters.bind(this));
        }

        if (this.overlayGeoSubmit) {
            this.overlayGeoSubmit.addEventListener('click', this.submitSearch.bind(this));
        }

        if (this.buttonFiltersReset) {
            this.buttonFiltersReset.addEventListener('click', this.handleButtonFiltersReset.bind(this));
        }
    }

    handleButtonFiltersReset(event) {
        this.emitter.emit('components.search.filters.reset', event);
    }

    openFilters(event) {
        this.emitter.emit('components.search.filters.open', event);
        this.filtersButton.setAttribute('aria-expanded', 'true');
    }

    showOverlay() {
        if (this.overlay) {
            this.el.classList.add('show_overlay');
            this.searchWrapper.classList.add('show_overlay');
            this.overlay.classList.add('show');
        }
    }

    hideOverlay() {
        if (this.overlay) {
            this.el.classList.remove('show_overlay');
            this.searchWrapper.classList.remove('show_overlay');
            this.overlay.classList.remove('show');
        }
    }

    submitSearch() {
        this.geoSubmit.click();
    }
}

SearchDefault.deps = ['eventEmitterService'];

export default SearchDefault;
