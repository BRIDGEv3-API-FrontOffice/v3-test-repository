import Component from '@components/scripts/base/Component';

class Critizr extends Component {
    init() {
        const apiKey = this.attr.apiKey;

        if (this.attr.active === true) {
            this.insertCritizrScript(window, document, 'script', 'https://static.critizr.com/widgets/' + apiKey + '.js', 'cz');
        }
    }

    insertCritizrScript(i, s, o, g, r) {
        i[r] = i[r];
        const a = s.createElement(o);
        const m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
    }
}

export default Critizr;
