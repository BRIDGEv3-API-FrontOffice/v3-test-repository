import Component from '@components/scripts/base/Component';

class ResultsLayout extends Component {
    init() {
        const results = parseInt(this.el.getAttribute('data-lf-results-length'));

        if (window.matchMedia('(min-width: 768px)').matches && results > 0) {
            const header = document.querySelector('[data-lf-header]');
            const main = this.el.querySelector('#lf-results-main');
            const top = this.el.querySelector('#lf-results-top');

            const pageHeight = window.innerHeight;
            const resultList = this.el.querySelector('[data-lf-results]');
            const resultTitle = this.el.querySelector('[data-lf-results-title]');

            if (pageHeight && header && top && resultList && resultTitle) {
                const mainHeight = parseInt(pageHeight - header.offsetHeight- top.offsetHeight);
                main.style.height = mainHeight + 'px';
                resultList.style.height = parseInt(mainHeight - resultTitle.offsetHeight) + 'px';
            }
        }
    }
}

export default ResultsLayout;
