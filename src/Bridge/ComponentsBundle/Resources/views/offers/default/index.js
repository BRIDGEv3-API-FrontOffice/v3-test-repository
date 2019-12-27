import Component from '@components/scripts/base/Component';

class OffersDefault extends Component {
    init() {
        this.list = this.el.querySelector('[data-lf-list]');
        this.listHeight = 0;
        this.listFullHeight = 0;

        this.timeOut = null;

        if (this.list) {
            this.items = this.el.querySelectorAll('[data-lf-offer]');
            this.toggler = this.el.querySelector('[data-lf-toggler]');

            if (this.items.length > 0 && this.toggler) {
                setTimeout(() => {
                    this.setListHeight();
                    this.toggleItems();
                    this.bindEvents();
                    // eslint-disable-next-line no-magic-numbers
                }, 50);
            }
        }
    }

    bindEvents() {
        this.toggler.addEventListener('click', this.toggleItems.bind(this));
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }

    setListHeight() {
        this.listFullHeight = this.list.scrollHeight;

        [].forEach.call(this.items, (item, index) => {
            if (index === 1) {
                this.listHeight = Math.ceil(item.offsetTop + item.offsetHeight);
            }
        });
    }

    toggleItems() {
        if (this.list.classList.contains('not-expanded')) {
            this.list.classList.remove('not-expanded');
            this.list.style.height = `${this.listFullHeight}px`;
        } else {
            this.list.classList.add('not-expanded');
            this.list.style.height = `${this.listHeight}px`;
        }

        if (this.toggler.classList.contains('not-expanded')) {
            this.toggler.classList.remove('not-expanded');
            this.toggler.innerText = this.toggler.getAttribute('data-lf-show-less');
            this.toggler.setAttribute('aria-expanded', 'true');
        } else {
            this.toggler.classList.add('not-expanded');
            this.toggler.innerText = this.toggler.getAttribute('data-lf-show-all');
            this.toggler.setAttribute('aria-expanded', 'false');
        }
    }

    handleWindowResize() {
        clearTimeout(this.timeOut);
        // eslint-disable-next-line no-magic-numbers
        this.timeOut = setTimeout(this.onWindowResize.bind(this), 300);
    }

    onWindowResize() {
        this.setListHeight();

        if (this.list.classList.contains('not-expanded')) {
            this.list.style.height = `${this.listHeight}px`;
        } else {
            this.list.style.height = `${this.listFullHeight}px`;
        }
    }
}

export default OffersDefault;
