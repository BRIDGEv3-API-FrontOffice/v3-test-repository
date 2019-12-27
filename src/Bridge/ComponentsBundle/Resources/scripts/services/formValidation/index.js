import { customEventPolyfill } from '@components/scripts/utils/customEventPolyfill';
import { assign } from '@components/scripts/utils/object';

const FormValidation = require('form.validation/dist/js/FormValidation.min.js');

class FormValidationService {
    constructor() {
        this._forms = [];
        this._widgetID = null;
        this._attr = null;

        this._defaultValidatorConfig = {
            framework: 'materialize',
            method: 'POST',
            recaptcha: false,
            override: {}
        };
    }

    init(ajaxService, importerService, eventEmitterService, notificationForm) {
        this._ajaxService = ajaxService;
        this._importerService = importerService;
        this._emitter = eventEmitterService;
        this._notificationForm = notificationForm;

        // Initialize customEvent polyfill
        customEventPolyfill();

        this._importDependencies([
            'https://www.google.com/recaptcha/api.js?onload=callValidatorsForms'
        ]);

        window.callValidatorsForms = () => {
            this._forms.forEach(form => {
                this.validateForm(form);
                this._checkFramework(form);
            });
        };
    }

    addForm(form, formOptions = {}) {
        this._forms.push({
            element: form,
            options: assign({}, this._defaultValidatorConfig, formOptions)
        });
    }

    validateForm(form) {
        if (form.options.recaptcha) {
            this.loadCaptcha(form);
        }

        const configTriggers = {event: {}};
        const triggersCustom = form.element.querySelectorAll('[data-trigger-custom]');

        [].forEach.call(triggersCustom, element => {
            configTriggers.event[element.name] = element.getAttribute('data-trigger-custom');
        });

        const fv = FormValidation.formValidation(form.element, {
            plugins: {
                message: new FormValidation.plugins.Message({
                    clazz: 'helper-text',
                    container: (field, element) => {
                        return element.parentElement;
                    }
                }),
                trigger: new FormValidation.plugins.Trigger(configTriggers),
                declarative: new FormValidation.plugins.Declarative({
                    html5Input: true
                }),
                submitButton: new FormValidation.plugins.SubmitButton()
            }
        });

        // Execute optionnal functions (defined by user)
        if (form.options.funcs && form.options.funcs.length > 0) {
            form.options.funcs.forEach(func => {
                func(form.element);
            });
        }

        fv.on('core.field.invalid', (field) => {
            const fieldElement = document.getElementsByName(field)[0];

            if (fieldElement.classList.contains('invalid')) {
                return false;
            }

            if (fieldElement.classList.contains('valid')) {
                fieldElement.classList.toggle('valid');
            }

            fieldElement.classList.toggle('invalid');
            fieldElement.setAttribute('aria-invalid', 'true');
            fieldElement.nextElementSibling.setAttribute('role', 'alert');
            fieldElement.nextElementSibling.setAttribute('aria-live', 'assertive');

            return true;
        });

        fv.on('core.field.valid', (field) => {
            const fieldElement = document.getElementsByName(field)[0];

            if (!fieldElement.classList.contains('invalid')) {
                return false;
            }

            if (fieldElement.classList.contains('invalid')) {
                fieldElement.classList.toggle('invalid');
            }

            if (fieldElement.classList.contains('valid')) {
                return false;
            }

            fieldElement.classList.toggle('valid');
            fieldElement.setAttribute('aria-invalid', 'false');

            return true;
        });

        // Avoiding submit to be re-attached by CustomEvent
        form.element.addEventListener('submit', (e) => {
            e.preventDefault();
        });

        fv.on('core.form.valid', () => {
            // Dispatching submit event for gtag (Basically, SubmitButton plugin removing the event)
            const event = new CustomEvent('submit', {
                bubbles: true, cancelable: true, detail: null
            });

            form.element.dispatchEvent(event);

            if (form.options.recaptcha) {
                // TODO: option widgetID
                window.grecaptcha.execute(form._id);
                return;
            }

            this.launchValidation(form);
        });
    }

    launchValidation(frm) {
        let form = frm;
        if (typeof form !== 'object') {
            form = this._getFormById(this._widgetID);
        }

        const data = new FormData(form.element);
        const url = form.element.getAttribute('action');
        let options = {
            method: form.options.method || 'POST',
            data: data,
            contentType: false,
            processData: false,
            cache: false
        };

        if (form.options.override.options && form.options.override.options.length > 0) {
            options = form.options.override.options;
        }

        this._ajaxService.callAjax(url, data, options)
            .then(() => {
                if (form.options.override.thenOW && typeof form.options.override.thenOW === 'function') {
                    form.options.override.thenOW(
                        {
                            form: form
                        });

                    return true;
                }

                const modalId = form.element.getAttribute('data-lf-modal-id');
                const message = form.element.getAttribute('data-lf-msg-success');
                this._notificationForm.displayNotifSuccess(message, form.element, this._emitter, modalId);

                this._emitter.emit('tracking_send_valid_form', form.element);

                form.element.reset();

                return true;
            })
            .catch((response) => {
                if (form.options.override.catchOW && typeof form.options.override.catchOW === 'function') {
                    form.options.override.catchOW(
                        {
                            error: response,
                            form: form
                        });

                    return false;
                }

                const message = form.element.getAttribute('data-lf-msg-error');
                this._notificationForm.displayNotifFail(message, form.element);

                // if (Object.prototype.toString.call(response.responseJSON) === '[object Object]') {
                //     const errResponse = response.responseJSON;
                //     message = errResponse.errors && errResponse.errors.length
                //         ? errResponse.errors.join(' ')
                //         : form.element.getAttribute('data-lf-msg-error');
                // } else {
                //     message = form.element.getAttribute('data-lf-msg-error');
                // }

                return false;
            })
            .finally(() => {
                if (form.options.override.finallyOW && typeof form.options.override.finallyOW === 'function') {
                    form.options.override.finallyOW(
                        {
                            form: form
                        });

                    return true;
                }

                if (form.options.recaptcha) {
                    window.grecaptcha.reset();
                }

                return true;
            });
    }

    loadCaptcha(form) {
        this._widgetID = window.grecaptcha.render(form.options.captchaContainer, {
            sitekey: this._attr.recaptcha.siteKey,
            badge: 'inline',
            size: 'invisible',
            callback: () => {
                this.launchValidation(form);
            }
        });
        form._id = this._widgetID;
    }

    sendParameters(parameters) {
        this._attr = parameters;
    }

    _importDependencies(dependencies) {
        this._importerService.import(dependencies);
    }

    _checkFramework(form) {
        // require('../../modules/common/forms/style');
        require('materialize/dist/js/materialize.min.js');

        switch (form.options.framework) {
            case 'materialize':
                this._putFrameworkClass(form, 'input-field');
                break;
            case 'bootstrap':
                this._putFrameworkClass(form, 'form-group');
                break;
            case 'custom':
                this._putFrameworkClass(form, 'custom-input');
                break;
            default:
                this._putFrameworkClass(form, 'custom-input');
                break;
        }
    }

    _putFrameworkClass(form, clazz) {
        const concernedInputs = form.element.querySelectorAll('.placeholder-fmk');

        [].forEach.call(concernedInputs, (input) => {
            input.classList.remove('placeholder-fmk');
            input.classList.add(clazz);
        });
    }
}

FormValidationService.deps = ['ajaxService', 'importerService', 'eventEmitterService', 'notificationForm'];

module.exports = FormValidationService;
