import Component from '@components/scripts/base/Component';

class HeaderLight extends Component {
    init() {
        this.toggler = this.el.querySelector('[data-lf-toggler]');
        this.toggled = this.el.querySelector('[data-lf-toggled]');

        this.bindEvents();
    }

    bindEvents() {
        if (this.toggler) {
            this.toggler.addEventListener('click', this.toggleMenu.bind(this));
        }
    }

    toggleMenu() {
        this.el.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
        if (this.toggled.getAttribute('aria-hidden')) {
            this.toggled.removeAttribute('aria-hidden');
        } else {
            this.toggled.setAttribute('aria-hidden', 'true');
        }
        //not really nice syntax ...
        this.toggler.setAttribute(
            'aria-expanded',
            this.toggler.getAttribute('aria-expanded') === 'true'
                ? 'false'
                : 'true'
        );
    }
}

export default HeaderLight;
