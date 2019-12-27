import Component from '@components/scripts/base/Component';

class resultList extends Component {
    init() {
        this.resultList = this.el.querySelectorAll('[data-lf-location]');
        this.resultFocusElement = this.el.querySelectorAll('[data-change-tabindex]');

        this.bindEvents();
    }

    bindEvents() {
        if(this.resultFocusElement) {
            [].forEach.call(this.resultFocusElement, item => {
                item.addEventListener('click', this.handleFocusItem.bind(this));
            });
        }
    }

    handleFocusItem(e) {
        e.preventDefault();
        this.resetTabindex();
        const listLink = e.target.parentElement.querySelectorAll('[tabindex="-1"]');

        [].forEach.call(listLink, item => {
            item.setAttribute('tabindex', '0');
            item.removeAttribute('aria-hidden');
        });
    }

    resetTabindex() {
        [].forEach.call(this.resultList, list => {
            const listLinks = list.querySelectorAll('[tabindex="0"]:not([data-change-tabindex])');
            [].forEach.call(listLinks, item => {
                item.setAttribute('tabindex', '-1');
                item.setAttribute('aria-hidden', 'true');
            });
        });
    }
}

export default resultList;
