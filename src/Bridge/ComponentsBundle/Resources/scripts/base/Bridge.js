import DependencyInjector from './DependencyInjector';
const GlobalsService = require('@components/scripts/services/globals');

class Bridge {
    constructor(modules = {}, services = {}) {
        this.container = new DependencyInjector();
        this.modules = modules;
        this.services = services;
        this.configService = null;
    }

    setModule(name, components) {
        this.modules[name] = components;
        return this;
    }

    setService(name, serviceClass) {
        this.services[name] = serviceClass;
        return this;
    }

    bootstrap(module, config = {}) {
        if (!this.modules[module]) {
            throw new Error(`Module ${module} not found`);
        }

        initConfig(this, config);
        initServices(this);
        initComponents(this, module);
    }
}

export default Bridge;

function getObjectDependencies(bridge, obj) {
    const depKeys = Array.isArray(obj.deps) ? obj.deps : [];
    return depKeys.map((depName) => {
        return bridge.container.get(depName);
    });
}

function initConfig(bridge, config) {
    bridge.container.value('globals', config);
    bridge.container.service('globalsService', ['globals', GlobalsService]);

    bridge.configService = bridge.container.get('globalsService');
}

function initServices(bridge) {
    Object.keys(bridge.services)
        .forEach((serviceName) => {
            const config = bridge.configService.getService(serviceName);
            const ServiceClass = bridge.services[serviceName];
            bridge.container.factory(serviceName, () => {
                const service = new ServiceClass(config); // eslint-disable-line new-cap
                if ('function' === typeof service.init) {
                    const deps = getObjectDependencies(bridge, ServiceClass);
                    service.init.apply(service, deps);
                }
                return service;
            });
        });
}

function initComponents(bridge, module) {
    const components = bridge.modules[module];
    Object
        .keys(components)
        .forEach((key) => {
            const {selector, provider} = components[key];
            initComponent(bridge, key, provider, selector);
        });
}

function initComponent(bridge, key, ProviderClass, selector) {
    const config = bridge.configService.getComponent(key);
    const module = document.querySelectorAll(selector);
    [].forEach.call(module, (el) => {
        const instance = new ProviderClass(el, config);
        const deps = getObjectDependencies(bridge, ProviderClass);

        instance.init(...deps);
    });
}
