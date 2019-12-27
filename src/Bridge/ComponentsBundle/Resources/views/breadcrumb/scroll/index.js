import Component from '@components/scripts/base/Component';

class BreadcrumScroll extends Component {
    init() {
        this.container = this.el.querySelector('[data-lf-breadcrumb-container]');
        this.list = this.el.querySelector('[data-lf-breadcrumb-list]');
        this.overlay = this.el.querySelector('[data-lf-breadcrumb-overlay]');

        if (this.list && this.container && this.list.offsetWidth > this.container.offsetWidth) {
            this.container.style.direction = 'rtl';
            this.list.style.marginLeft = '40px';

            if (this.overlay) {
                this.overlay.classList.add('show');
            }
        }
    }
}

export default BreadcrumScroll;
