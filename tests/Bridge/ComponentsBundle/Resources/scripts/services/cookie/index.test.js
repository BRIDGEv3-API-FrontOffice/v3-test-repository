import CookieService from '@components/scripts/services/cookie';

describe('Bridge/ComponentsBundle/Resources/scripts/services/cookie', () => {
    let service;

    beforeEach(() => {
        service = new CookieService();
    });

    describe('create', () => {
        it('should add a new entry with a name and a value', () => {
            service.create('foo', 'bar');
            expect(document.cookie).toContain('foo=bar');
        });
    });

    describe('read', () => {
        it('should retrieve an entry value given its name', () => {
            service.create('foo', 'bar');
            expect(service.read('foo', false)).toEqual('bar');
        });

        it('should retrieve an entry JSON value given its name', () => {
            service.create('foo', '{"hello": "world"}');
            expect(service.read('foo', true)).toEqual({hello: 'world'});
        });
    });

    describe('remove', () => {
        it('should delete an entry given its name', () => {
            service.create('foo', 'bar');
            service.remove('foo');
            expect(document.cookie).not.toContain('foo=bar');
        });
    });
});
