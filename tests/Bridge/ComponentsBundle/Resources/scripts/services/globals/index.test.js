import GlobalsService from '@components/scripts/services/globals';

describe('Bridge/ComponentsBundle/Resources/scripts/services/globals', () => {
    describe('contructor', () => {
        it('should instantiate a component without configuration', () => {
            const service = new GlobalsService();
            expect(service.globals).toEqual({});
            expect(service.services).toEqual({});
            expect(service.components).toEqual({});
        });

        it('should instantiate a component with configuration', () => {
            const globals = { aGlobal: 'test' };
            const services = { aService: 'test' };
            const components = { aComponent: 'test'};
            const service = new GlobalsService({
                globals: globals,
                services: services,
                components: components
            });
            expect(service.globals).toBe(globals);
            expect(service.services).toBe(services);
            expect(service.components).toBe(components);
        });
    });

    describe('get', () => {
        it('should return a value', () => {
            const service = new GlobalsService({
                globals: { aConstant: 'test' }
            });
            expect(service.get('aConstant')).toBe('test');
        });
    });

    describe('getService', () => {
        it('should return a value', () => {
            const service = new GlobalsService({
                services: { aService: 'test' }
            });
            expect(service.getService('aService')).toBe('test');
        });
    });

    describe('getComponent', () => {
        it('should return a value', () => {
            const service = new GlobalsService({
                components: { aComponent: 'test' }
            });
            expect(service.getComponent('aComponent')).toBe('test');
        });
    });
});
