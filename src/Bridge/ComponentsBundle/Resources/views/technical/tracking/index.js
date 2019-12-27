import Component from '@components/scripts/base/Component';

/* global dataLayer, ga */

class TechnicalTracking extends Component {
    init(eventEmitterService) {
        this._emitter = eventEmitterService;
        this.parameters = this.attr.parameters;
        this.keys = this.attr.keys;
        this.locale = this.el.getAttribute('data-bridge-tracking-locale');

        this.bind(this.parameters, this.el, this.keys);

        this.bindEvents();
    }

    bindEvents() {
        this._emitter.on('tracking_send_valid_form', this.sendValidForm.bind(this));
    }

    bind(parameters, doc, keys) {
        window.cookieconsent.onCookiesEnabled.push(() => {
            const trackingElements = doc.querySelectorAll('[data-lf-tracking]');
            [].forEach.call(trackingElements, (el) => {
                const {bind, category, action, label} = this.getTrackingParams(el);

                switch (bind) {
                    case 'click':
                        el.addEventListener('click', () => {
                            this.eventTracking(category, action, label, parameters, keys);
                        });
                        break;

                    case 'display':
                        this.eventTracking(category, action, label, parameters, keys);
                        break;

                    default:
                        break;
                }
            });
        });
    }

    sendValidForm(form) {
        const {category, action, label} = this.getTrackingParams(form);

        this.eventTracking(category, action, label, this.parameters, this.keys);
    }

    getTrackingParams(el) {
        const data = JSON.parse(el.getAttribute('data-lf-tracking'));
        const bind = data.bind || '';
        const category = data.category || '';
        let action = data.action || '';
        const label = data.label || '';

        // Reconstruct action variable
        action = this.parameters.page + ' | ' + bind + (action !== '' ? ' | ' + action : '');

        return {bind, category, action, label};
    }

    eventTracking(category, action, label, parameters, obj) {
        for (const key of Object.keys(obj)) {
            const substrMax = 3;
            const isGTM = obj[key][this.locale].substring(0, substrMax) === 'GTM';

            if (isGTM) {
                dataLayer.push({
                    event: 'event',
                    eventCategory: category,
                    eventAction: action,
                    eventLabel: label
                });
            } else {
                if (parameters.page === 'search') {
                    ga(key + '.set', 'dimension1', parameters.query);
                    ga(key + '.set', 'dimension2', parameters.count);
                }

                if (parameters.page === 'location') {
                    ga(key + '.set', 'dimension3', parameters.location.id);
                    ga(key + '.set', 'dimension4', parameters.location.name);
                }

                ga(key + '.send', 'event', category, action, label, 0, false);
            }
        }
    }
}

TechnicalTracking.deps = ['eventEmitterService'];

export default TechnicalTracking;
