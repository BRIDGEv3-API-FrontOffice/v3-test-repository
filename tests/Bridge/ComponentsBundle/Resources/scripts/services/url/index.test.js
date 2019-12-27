import UrlService from '@components/scripts/services/url';

describe('Bridge/ComponentsBundle/Resources/scripts/services/url', () => {
    let service;

    beforeEach(() => {
        service = new UrlService();
        service.getWindowLocationSearch = function() {
            return '?foo=bar&some=thing';
        };
    });

    describe('getWindowLocationSearch', () => {
        it('should return mocked location search for testing', () => {
            expect(service.getWindowLocationSearch()).toEqual('?foo=bar&some=thing');
        });
    });

    describe('getUrlParameter', () => {
        it('should return value of a given url parameter', () => {
            expect(service.getUrlParameter('foo')).toEqual('bar');
        });

        it('should return null of a given url parameter that doesn\'t exists', () => {
            expect(service.getUrlParameter('test')).toBeNull();
        });
    });

    describe('getMutipleUrlParameters', () => {
        it('should return all url parameters in an object', () => {
            expect(service.getMutipleUrlParameters('?foo=bar&some=thing')).toEqual({foo: 'bar', some: 'thing'});
        });
    });

    describe('getParametersString', () => {
        it('should return url parameters string', () => {
            expect(service.getParametersString(['foo=bar', 'some=thing'])).toEqual('?foo=bar&some=thing');
        });
    });
});
