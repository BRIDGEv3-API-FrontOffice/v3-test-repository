import Component from '@components/scripts/base/Component';

class Presentation extends Component {
    init() {
        this.content = this.el.querySelector('[data-lf-content]');
        this.expand = this.el.querySelector('[data-lf-expand]');

        if (this.content && this.expand) {
            this.displayExpand();
            this.bindEvents();
        }
    }

    bindEvents() {
        this.expand.addEventListener('click', this.handleExpandClick.bind(this));
    }

    displayExpand() {
        if (this.content.offsetHeight + 1 < this.content.scrollHeight) {
            this.expand.classList.add('show');
        }
    }

    handleExpandClick() {
        this.content.classList.remove('ellipsis');
        this.expand.classList.remove('show');
    }
}

export default Presentation;
