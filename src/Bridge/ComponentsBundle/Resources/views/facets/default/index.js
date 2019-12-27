import Component from '@components/scripts/base/Component';
import {mobile} from '@components/scripts/utils/mobile';

class Facets extends Component {
    init() {
        this.toggler = this.el.querySelector('[data-lf-facets-toggler]');
        this.list = this.el.querySelector('[data-lf-facets-list]');

        if (this.toggler && this.list) {
            this.listFullHeight = this.list.offsetHeight;

            this.initListHeight();
            this.bindEvents();
        }
    }

    initListHeight() {
        if (mobile()) {
            this.list.style.height = 0;
        }
    }

    bindEvents() {
        this.toggler.addEventListener('click', this.handleTogglerClick.bind(this));
    }

    handleTogglerClick() {
        this.el.classList.toggle('open');
        if (this.list.style.height === '0px') {
            this.list.style.height = `${this.listFullHeight}px`;
        } else {
            this.list.style.height = 0;
        }
    }
}

export default Facets;
