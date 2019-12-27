import Component from '@components/scripts/base/Component';

class OpeningHours extends Component {
    init() {
        this.expand = this.el.querySelector('[data-lf-expand]');
        this.el.setAttribute('aria-hidden', 'true');
        this.bindEvents();
    }

    bindEvents() {
        this.expand.addEventListener('click', this.handleExpandClick.bind(this));
    }

    handleExpandClick() {
        this.el.classList.add('expanded');
    }
}

export default OpeningHours;
