import Component from '../../../../scripts/base/Component';
import intlTelInput from 'intl-tel-input/build/js/intlTelInput';
import intlTelInputUtils from 'intl-tel-input/build/js/utils';

class Forms extends Component {
    getDefaultAttributes() {
        return {
            framework: 'materialize',
            recaptcha: false,
            captchaContainer: null,
            override: false,
            funcs: []
        };
    }

    init(formValidationService, eventEmitterService, notificationForm) {
        this.formValidation = formValidationService;
        this.emitter = eventEmitterService;
        this.notificationForm = notificationForm;
        this.initForm(this.attr);
    }

    initForm(parameters) {
        const form = this.el;
        const additionalFunctions = parameters.funcs && Array.isArray(parameters.funcs) ? parameters.funcs : [];

        this.formValidation.sendParameters(parameters);

        additionalFunctions.forEach((func, index) => {
            if (typeof this[func] === 'function') {
                additionalFunctions[index] = this[func].bind(this);
            }
        });

        this.formValidation.addForm(form, {
            framework: parameters.framework,
            recaptcha: parameters.recaptcha.active,
            captchaContainer: document.querySelector(`${parameters.recaptcha.container}`),
            override: {
                // The default options payload is defined as follow :
                // {
                //     method: form.options.method || 'POST',
                //     data: data,
                //     contentType: false,
                //     processData: false,
                //     cache: false
                // };
                // You can define a new options payload in the theme.yml (for the correct form)
                // Define it as follow :
                // override :
                //   options:
                //      method: String
                //      contentType: boolean
                //      processData: boolean
                //      cache: boolean
                // You can also define processing form functions override (put them in this class)
                // The override functions have to be defined in this class with same name as in theme.yml under override -> (thenOW or catchOW or finalOW)
                thenOW: parameters.override.thenOW ? this[parameters.override.thenOW].bind(this) : false,
                catchOW: parameters.override.catchOW ? this[parameters.override.catchOW].bind(this) : false,
                finallyOW: parameters.override ? this[parameters.override.finalOW].bind(this) : false
            },
            // You can also define functions to be executed during the form initialization (has to be an array)
            // The new functions have to be defined in this class with same name as in theme.yml
            funcs: additionalFunctions
        });
    }

    // You can define as many promises overrides as you want as long as you name them differently.
    // Here, the promises overrides are suitable for both newsletter and address form so we don't need to redefine others.

    // Example of then promise overriding (during form processing)
    // thenOverride() {
    // }

    // Example of catch promise overriding (during form processing)
    // catchOverride() {
    // }

    // Example of finally promise overriding (during form processing)
    finallyOverride(params) {
        const modal = document.querySelector('#modal-' + params.form.element.id);
        if (modal) {
            modal.modal('hide');
        }

        params.form.element.reset();
        // params.form.element.data('formValidation').resetForm();
    }

    // You can define functions to be call for each form here or in another class
    // (then import it in the top of the Forms class)
    definePhoneValidation(form) {
        const phoneInput = form.querySelector('#location-address-form_bridge-user-phone');
        const mailInput = form.querySelector('[type="email"]');
        const submit = form.querySelector('[type="submit"]');
        const defaultPhoneCountry = form.querySelector('#location-address-form_bridge-phone-country');
        const iti = intlTelInput(phoneInput, {
            utilsScript: intlTelInputUtils,
            initialCountry: defaultPhoneCountry ? defaultPhoneCountry.value : ''
        });

        if (submit && mailInput && phoneInput && defaultPhoneCountry) {
            submit.addEventListener('click', () => {
                const hiddenCountry = document.querySelector('#location-address-form_bridge-phone-country');
                const selectedCountryData = iti.getSelectedCountryData();
                hiddenCountry.value = selectedCountryData.iso2;
            });
        }
    }
    initModalConfig(form) {
        const modalId = form.getAttribute('data-lf-modal-id');
        const modal = document.getElementById(modalId);
        //const formModalContainer = modal.querySelector('[data-micromodal-close]');
        this.emitter.on('component.modal.show.' + modal.id, () => {
            const firstInput = form.getElementsByTagName('input')[0];
            firstInput.focus();
        });

        this.emitter.on('component.modal.close.' + modal.id, () => {
            this.notificationForm.reset(form);
        });
    }
}

Forms.deps = ['formValidationService', 'eventEmitterService', 'notificationForm'];

export default Forms;
