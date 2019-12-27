import Component from '@components/scripts/base/Component';

let resizeTime;

class ExpandHeader extends Component {
    init() {
        this.header = this.el;
        this.nav = this.el.querySelector('[data-lf-nav]');
        this.desktopNavLinks = this.el.querySelector('[data-lf-desktop-items]');
        this.logo = this.el.querySelector('[data-lf-logo]');
        this.expandButton = this.el.querySelector('[data-lf-expand-header]');
        this.page = document.querySelector('body');
        this.wrapper = this.page.querySelector('#lf-body-wrapper');

        // Events binding
        this.bindExpandHeaderEvent();
        this.calcWidth();
    }

    bindExpandHeaderEvent() {
        if(this.expandButton) {
            this.expandButton.addEventListener('click', this.toggleHeader.bind(this));
        }
        window.addEventListener('resize', this.resizeCalc.bind(this));
    }

    toggleHeader() {
        const wHeight = document.documentElement.clientHeight;
        if(this.page && this.wrapper) {
            if(this.page.classList.contains('lf-menu-open')) {
                this.page.classList.remove('lf-menu-open');
                this.wrapper.style.maxHeight = '';
            } else {
                this.page.classList.add('lf-menu-open');
                this.wrapper.style.maxHeight = wHeight + 'px';
            }
        }
    }

    calcWidth() {
        if(this.page) {
            this.page.classList.remove('lf-menu-open');
        }
        this.header.classList.remove('mobile-version');
        const headerWidth = this.header.offsetWidth;
        const listWidth = this.desktopNavLinks.offsetWidth;
        let additionalWidth = 0;
        if(!this.nav.classList.contains('lf-header-optimum-tworows')) {
            additionalWidth = this.logo.offsetWidth;
        }
        const menuWidth = listWidth + additionalWidth;
        if(menuWidth > headerWidth) {
            this.header.classList.add('mobile-version');
        }
    }

    /*eslint no-magic-numbers: ["error", { "ignore": [500] }]*/
    resizeCalc() {
        clearTimeout(resizeTime);
        resizeTime = window.setTimeout(() => {
            this.calcWidth();
        }, 500);
    }
}

export default ExpandHeader;
