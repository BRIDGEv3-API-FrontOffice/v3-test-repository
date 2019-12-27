
import { assign } from '@components/scripts/utils/object';

describe('assign', () => {
    it('should throw if target is undefined', () => {
        expect(() => {
            assign();
        }).toThrow(new TypeError('Cannot convert undefined or null to object'));
    });

    it('should throw if target is null', () => {
        expect(() => {
            assign(null);
        }).toThrow(new TypeError('Cannot convert undefined or null to object'));
    });

    it('should throw if source is undefined', () => {
        const o = {};
        expect(assign(o)).toBe(o);
    });

    it('should throw if target is null', () => {
        const o = {};
        expect(assign(o, null)).toBe(o);
    });

    it('should assign merge an object', () => {
        const o = { test: 'value' };

        expect(assign(o, { test2: 'value2' })).toEqual({ test: 'value', test2: 'value2' });
    });

    it('should assign merge multiple objects', () => {
        const o1 = { test1: 'value1' };
        const o2 = { test2: 'value2' };
        const o3 = { test3: 'value3' };

        expect(assign(o1, o2, o3)).toEqual({
            test1: 'value1',
            test2: 'value2',
            test3: 'value3'
        });
    });
});
