import Component from '@components/scripts/base/Component';

class Fax extends Component {
    init() {
        this.number = document.querySelector(`[data-lf-fax-link="${this.el.getAttribute('data-lf-fax')}"]`);

        if (this.number) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.el.addEventListener('click', this.showFaxNumber.bind(this));
    }

    showFaxNumber() {
        this.el.classList.add('hidden');
        this.number.classList.remove('hidden');
    }
}

export default Fax;
