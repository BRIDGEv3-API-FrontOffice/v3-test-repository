import EventEmitterService from '@components/scripts/services/eventEmitter';

describe('Bridge/ComponentsBundle/Resources/scripts/services/eventEmitter', () => {
    let service;
    let fct;
    const event = 'myEvent';
    const invalidEvent = 'invalidEvent';

    beforeEach(() => {
        service = new EventEmitterService();
        fct = jasmine.createSpy('myFunction');
    });

    describe('contructor', () => {
        it('should instantiate a service without configuration', () => {
            expect(service._events).toEqual({});
        });
    });

    describe('on', () => {
        it('should bind to an event given functions', () => {
            service.on(event, fct);
            expect(service._events[event]).toEqual([fct]);

            service.on(event, fct);
            expect(service._events[event]).toEqual([fct, fct]);
        });
    });

    describe('off', () => {
        it('should do nothing if event does not exist', () => {
            service.on(event, fct);
            expect(service._events[event]).toEqual([fct]);

            service.off(invalidEvent, fct);
            expect(service._events[event]).toEqual([fct]);
        });

        it('should unbind to an event given functions', () => {
            service.on(event, fct);
            expect(service._events[event]).toEqual([fct]);

            service.off(event, fct);
            expect(service._events[event]).toEqual([]);
        });
    });

    describe('emit', () => {
        it('should do nothing if event does not exist', () => {
            service.on(event, fct);
            expect(service._events[event]).toEqual([fct]);

            service.emit(invalidEvent);
            expect(fct).not.toHaveBeenCalled();
        });

        it('should emit an event', () => {
            service.on(event, fct);
            expect(service._events[event]).toEqual([fct]);

            service.emit(event, 'param1', 'param2');
            expect(fct).toHaveBeenCalledWith('param1', 'param2');
        });
    });
});
