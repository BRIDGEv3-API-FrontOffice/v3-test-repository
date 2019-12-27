function customEventPolyfill() {
    if (typeof window.CustomEvent === 'function') {
        return false;
    }

    function CustomEvent(event, params) {
        const parameters = params || { bubbles: true, cancelable: true, detail: null };
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, parameters.bubbles, parameters.cancelable, parameters.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;

    return true;
}

export {customEventPolyfill};
