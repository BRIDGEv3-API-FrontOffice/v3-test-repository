import Component from '@components/scripts/base/Component';

class Location extends Component {
    init(eventEmitterService) {
        this.emitter = eventEmitterService;
        this.options = this.el.querySelector('[data-lf-options]');
        this.actions = this.el.querySelector(`[data-lf-actions="${this.el.getAttribute('data-lf-location')}"]`);

        if (this.options && this.actions) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.options.addEventListener('click', this.openActions.bind(this));

        this.locate = this.actions.querySelector('[data-lf-locate-on-map]');

        if (this.locate) {
            this.locate.addEventListener('click', this.locateOnMap.bind(this));
        }
    }

    openActions() {
        this.el.classList.add('active');
        this.el.classList.add('no-events');
        this.actions.classList.remove('hidden');

        document.addEventListener('click', this.dismissActions.bind(this));
    }

    dismissActions(e) {
        if (!this.actions.contains(e.target) && !this.options.contains(e.target)) {
            this.closeActions();
        }
    }

    closeActions() {
        this.el.classList.remove('active');
        this.el.classList.remove('no-events');
        this.actions.classList.add('hidden');

        document.removeEventListener('click', this.dismissActions.bind(this));
    }

    locateOnMap() {
        this.closeActions();
        this.emitter.emit('modules.mapInteraction.focusOnLocation', this.el.getAttribute('data-lf-location'));
    }
}

Location.deps = ['eventEmitterService'];

export default Location;
