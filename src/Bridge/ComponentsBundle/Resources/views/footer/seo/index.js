import Component from '@components/scripts/base/Component';

class FooterSeo extends Component {
    init() {
        this.toggler = this.el.querySelector('[data-lf-toggle]');

        if (this.toggler) {
            this.initExpand();
        }
    }

    bindEvents() {
        this.toggler.addEventListener('click', this.toggleExpand.bind(this));
    }

    initExpand() {
        this.expand = this.el.querySelector(this.toggler.getAttribute('data-lf-toggle'));

        if (this.expand) {
            this.bindEvents();
        }
    }

    toggleExpand() {
        const span = this.toggler.querySelector('span');
        const em = this.toggler.querySelector('em');

        const showIcon = this.toggler.getAttribute('data-lf-show-icon');
        const hideIcon = this.toggler.getAttribute('data-lf-hide-icon');

        if (this.expand.classList.contains('hidden')) {
            span.innerText = this.toggler.getAttribute('data-lf-hide-label');
            em.classList.remove(showIcon);
            em.classList.add(hideIcon);
            this.expand.classList.remove('hidden');
            this.expand.style.height = `${this.expand.scrollHeight}px`;
        } else {
            span.innerText = this.toggler.getAttribute('data-lf-show-label');
            em.classList.remove(hideIcon);
            em.classList.add(showIcon);
            this.expand.classList.add('hidden');
            this.expand.style.height = null;
        }
    }
}

export default FooterSeo;
