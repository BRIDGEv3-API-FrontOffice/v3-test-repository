import Component from '@components/scripts/base/Component';

describe('Bridge/ComponentsBundle/Resources/scripts/base/Component.js', () => {
    describe('contructor', () => {
        it('should instratiate a component', () => {
            const el = '<div></div>';
            const attributes = { attr: 'value'};
            const component = new Component(el, attributes);
            expect(component.el).toBe(el);
            expect(component.attr).toEqual(attributes);
        });
    });

    describe('getDefaultAttributes', () => {
        it('should return an empty object', () => {
            const component = new Component();
            expect(component.getDefaultAttributes()).toEqual({});
        });
    });

    describe('init', () => {
        it('should throw', () => {
            const component = new Component();
            expect(() => {
                component.init();
            }).toThrow(new Error('Component.init method must be overriden'));
        });
    });
});
