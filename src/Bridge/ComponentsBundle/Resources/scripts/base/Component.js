import {assign} from '@components/scripts/utils/object';

class Component {
    constructor(el, attributes = {}) {
        this.el = el;
        this.attr = assign(this.getDefaultAttributes(), attributes);
    }

    getDefaultAttributes() {
        return {};
    }

    init() {
        throw new Error('Component.init method must be overriden');
    }
}

export default Component;
