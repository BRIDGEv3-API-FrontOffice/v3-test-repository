import Component from '@components/scripts/base/Component';

class OffersIcon extends Component {
    init() {
        this.list = this.el.querySelector('[data-lf-list]');
        this.listHeight = 0;
        this.listFullHeight = 0;

        this.timeOut = null;

        if (this.list) {
            this.items = this.el.querySelectorAll('[data-lf-offer]');
            this.togglers = this.el.querySelectorAll('[data-lf-toggler]');

            if (this.items.length > 0 && this.togglers.length > 0) {
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
        [].forEach.call(this.togglers, toggler => {
            toggler.addEventListener('click', this.toggleItems.bind(this));
        });
        window.addEventListener('resize', this.handleWindowResize.bind(this));
    }

    setListHeight() {
        this.listFullHeight = this.list.scrollHeight;

        [].forEach.call(this.items, (item, index) => {
            // eslint-disable-next-line no-magic-numbers
            if (index === 4) {
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

        [].forEach.call(this.togglers, toggler => {
            if (toggler.classList.contains('not-expanded')) {
                toggler.classList.remove('not-expanded');
                toggler.innerText = toggler.getAttribute('data-lf-show-less');
                toggler.setAttribute('aria-expanded', 'true');
            } else {
                toggler.classList.add('not-expanded');
                toggler.innerText = toggler.getAttribute('data-lf-show-all');
                toggler.setAttribute('aria-expanded', 'false');
            }
        });
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

export default OffersIcon;
