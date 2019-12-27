class GlobalsService {
    constructor(config = {}) {
        this.globals = config.globals || {};
        this.services = config.services || {};
        this.components = config.components || {};
    }

    get(key) {
        return this.globals[key];
    }

    getService(key) {
        return this.services[key];
    }

    getComponent(key) {
        return this.components[key];
    }
}

module.exports = GlobalsService;
