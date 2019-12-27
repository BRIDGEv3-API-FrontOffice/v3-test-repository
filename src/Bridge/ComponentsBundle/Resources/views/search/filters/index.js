import Component from '@components/scripts/base/Component';

class SearchFilters extends Component {
    init(eventEmitterService, urlService) {
        this.emitter = eventEmitterService;
        this.urlService = urlService;

        this.buttonReset = this.el.querySelector('[data-lf-filters-reset]');
        this.buttonSubmit = this.el.querySelector('[data-lf-filters-submit]');

        this.inputs = this.el.querySelectorAll('[data-lf-filters-input]');

        this.bindEvents();
    }

    bindEvents() {
        this.emitter.on('components.search.filters.open', this.handleToggle.bind(this));
        this.emitter.on('components.search.filters.reset', this.handleReset.bind(this));

        if (this.buttonReset) {
            this.buttonReset.addEventListener('click', this.handleReset.bind(this));
        }

        if (this.buttonSubmit) {
            this.buttonSubmit.addEventListener('click', this.handleSubmit.bind(this));
        }
    }

    handleToggle(event) {
        event.preventDefault();
        //this.el.classList.add('active');
        //open
        if (!this.el.classList.contains('active')) {
            this.el.classList.add('active');
            this.emitter.emit('components.search.default.showOverlay');
        } else { // close
            this.el.classList.remove('active');
            this.emitter.emit('components.search.default.hideOverlay');
        }
    }

    handleReset(event) {
        event.preventDefault();

        if (this.inputs.length > 0) {
            [].forEach.call(this.inputs, input => {
                input.checked = false;
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.buttonSubmit.form.submit();
    }
}

SearchFilters.deps = ['eventEmitterService', 'urlService'];

export default SearchFilters;
