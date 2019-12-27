// @see https://github.com/janmarek/JsDic

class DependencyInjector {
    constructor() {
        this.values = {};
        this.factories = {};
        this.services = {};
        this.instances = {};
    }

    /**
     * Get service instance
     * @param {string} name Dependency name
     * @return {mixed} The dependency
     */
    get(name) {
        return this.getWithHistory(name, []);
    }

    /**
     * Set a constant to container
     * @param {String} name Constant name
     * @param {*} value Constant value
     * @return {DependencyInjector} Injector instance
     */
    value(name, value) {
        this.values[name] = value;
        this.addProperty(name);
        return this;
    }

    /**
     * Set service factory to container
     * @param {String} name Depenency name
     * @param {(Array|Function)} definition Dependency definition
     * @return {DependencyInjector} Injector instance
     */
    factory(name, definition) {
        this.factories[name] = this.parseDefinition(name, definition);
        this.addProperty(name);
        return this;
    }

    /**
     * Set service definition
     * @param {String} name Depency name
     * @param {(Array|Function)} definition Dependency definition
     * @return {DependencyInjector} Injector instance
     */
    service(name, definition) {
        this.services[name] = this.parseDefinition(name, definition);
        this.addProperty(name);
        return this;
    }

    /**
     * Add a property to the injector
     * @param {String} name Property name
     * @return {void}
     */
    addProperty(name) {
        if (Object.defineProperty) {
            Object.defineProperty(this, name, {
                get: () => {
                    return this.get(name);
                }
            });
        }
    }

    /**
     * @private
     * @param {string} name Dependency name
     * @param {String[]} history Array of depenency strings
     * @return {*} A dependency
     */
    getWithHistory(name, history) {
        for (let i = 0; i < history.length; i++) {
            if (history[i] === name) {
                const deps = [name].concat(history).reverse().join(' <- ');
                throw new Error(`Circular dependency detected: ${deps}`);
            }
        }

        history = [name].concat(history); // eslint-disable-line no-param-reassign

        if (typeof this.instances[name] !== 'undefined') {
            return this.instances[name];
        }

        if (typeof this.values[name] !== 'undefined') {
            return this.values[name];
        }

        if (typeof this.services[name] !== 'undefined') {
            const definition = this.services[name];
            const args = this.getDependencies(definition, history);
            this.instances[name] = this.instantiateService(definition.fnc, args);
            return this.instances[name];
        }

        if (typeof this.factories[name] !== 'undefined') {
            const definition = this.factories[name];
            const args = this.getDependencies(definition, history);
            this.instances[name] = definition.fnc.apply(null, args);
            return this.instances[name];
        }

        const dep = history.join(' <- ');

        throw new Error(`${dep} is not registered in container`);
    }

    /**
    * @private
    * @param {*} constructor Dependency constructor
    * @param {Array} args Array of arguments
    * @return {*} Service instance
    */
    instantiateService(constructor, args) {
        const Class = Function.prototype.bind.apply(constructor, [null].concat(args));
        return new Class();
    }

    /**
    * @private
    * @param {function} target Constructor
    * @return {array} Array of cosntructor arguments
    */
    getArguments(target) {
        const FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
        const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
        const text = target.toString();
        const argsTxt = text.match(FN_ARGS)[1]
            .replace(/\s+/g, '')
            .replace(STRIP_COMMENTS, '');

        if (argsTxt === '') {
            return [];
        }

        const args = argsTxt.split(',');

        return args;
    }

    /**
     * @private
     * @param {*} definition Service definition
     * @param {String[]} history Array of dependencies strings
     * @return {Array} Array of dependencies
     */
    getDependencies(definition, history) {
        const names = definition.dependencies || this.getArguments(definition.fnc);
        return names.map((value) => {
            return this.getWithHistory(value, history);
        });
    }

    /**
     * @private
     * @param {string} name Dependency name
     * @param {*} definition Dependency definition
     * @return {Object} Dependency object
     */
    parseDefinition(name, definition) {
        if (definition.constructor === Array) {
            const fnc = definition.pop();
            return {fnc: fnc, dependencies: definition};
        }

        if (typeof definition === 'function') {
            return {fnc: definition, dependencies: null};
        }

        throw new Error(`${name}: second argument should be an array or function`);
    }
}

export default DependencyInjector;
