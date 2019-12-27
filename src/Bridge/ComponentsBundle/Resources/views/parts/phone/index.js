import Component from '@components/scripts/base/Component';

class Phone extends Component {
    init() {
        this.link = document.querySelector(`[data-lf-phone-link="${this.el.getAttribute('data-lf-phone')}"]`);

        if (this.link) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.el.addEventListener('click', this.showPhoneNumber.bind(this));
    }

    showPhoneNumber() {
        this.el.classList.add('hidden');
        this.link.classList.remove('hidden');
    }
}

export default Phone;
