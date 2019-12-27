class EventEmitterService {
    constructor() {
        this._events = {};
    }

    on(event, fct) {
        this._events[event] = this._events[event] || [];
        this._events[event].push(fct);
    }

    off(event, fct) {
        if (typeof fct === 'function') {
            if (event in this._events === false) {
                return;
            }
            this._events[event].splice(this._events[event].indexOf(fct), 1);
        }
    }

    emit(event) {
        if (event in this._events === false) {
            return;
        }
        for (let i = 0; i < this._events[event].length; i++) {
            this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
        }
    }
}

module.exports = EventEmitterService;
