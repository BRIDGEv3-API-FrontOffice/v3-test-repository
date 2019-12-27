import DependecyInjector from '@components/scripts/base/DependencyInjector';

// https://github.com/janmarek/JsDic
describe('Bridge/ComponentsBundle/Resources/scripts/base/DependecyInjector', () => {
    let dic;
    beforeEach(() => {
        dic = new DependecyInjector();
    });

    describe('getArguments', () => {
        it('recognizes empty array', () => {
            const args = dic.getArguments(() => {});
            expect([]).toEqual(args);
        });
        it('recognizes empty array with space', () => {
            const args = dic.getArguments(() => {});
            expect([]).toEqual(args);
        });
        it('recognizes one arg', () => {
            const args = dic.getArguments((a) => {
                return a;
            });
            expect(['a']).toEqual(args);
        });
        it('recognizes one arg with space', () => {
            const args = dic.getArguments((a) => {
                return a;
            });
            expect(['a']).toEqual(args);
        });
        it('recognizes multiple args with whitespace', () => {
            const args = dic.getArguments((a, b, c) => {
                return [a, b, c];
            });
            expect(['a', 'b', 'c']).toEqual(args);
        });
        it('removes inline comments', () => {
            function fnc(a, b) {
                return [a, b];
            }

            const args = dic.getArguments(fnc);
            expect(['a', 'b']).toEqual(args);
        });
    });

    it('can instantiate service', () => {
        function Cls(a, b) {
            this.a = a;
            this.b = b;
        }

        const obj = dic.instantiateService(Cls, [1, 2]); // eslint-disable-line no-magic-numbers
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(2); // eslint-disable-line no-magic-numbers
    });

    it('can instantiate service and handle this correctly', () => {
        function ThisCls(a, b) {
            this.init(a, b);
        }

        ThisCls.prototype.init = function(a, b) {
            this.a = a; // eslint-disable-line no-invalid-this
            this.b = b; // eslint-disable-line no-invalid-this
        };

        const obj = dic.instantiateService(ThisCls, [1, 2]); // eslint-disable-line no-magic-numbers
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(2); // eslint-disable-line no-magic-numbers

        expect(obj.constructor).toBe(ThisCls);
        expect(obj.init).toBe(ThisCls.prototype.init);
    });

    it('handles values', () => {
        dic
            .value('a', 1)
            .value('b', 2); // eslint-disable-line no-magic-numbers
        expect(dic.get('b'))
            .toBe(2); // eslint-disable-line no-magic-numbers
    });

    it('handles factories without params', () => {
        dic.factory('factory', () => {
            return 3; // eslint-disable-line no-magic-numbers
        });

        expect(dic.get('factory')).toBe(3); // eslint-disable-line no-magic-numbers
    });

    it('handles factories with params', () => {
        dic
            .value('a', 1)
            .value('b', 2) // eslint-disable-line no-magic-numbers
            .factory('factory', (a, b) => {
                return a + b;
            });

        expect(dic.get('factory')).toBe(3); // eslint-disable-line no-magic-numbers
    });

    it('handles factories with defined dependencies', () => {
        dic
            .value('_a', 1)
            .value('_b', 2) // eslint-disable-line no-magic-numbers
            .factory('factory', ['_a', '_b', (a, b) => {
                return a + b;
            }]);

        expect(dic.get('factory')).toBe(3); // eslint-disable-line no-magic-numbers
    });

    it('get returns always the same instance for factories', () => {
        function Cls() {

        }

        dic.factory('factory', () => {
            return new Cls();
        });

        const a = dic.get('factory');
        const b = dic.get('factory');
        expect(a).toBe(b);
    });

    it('handles services', () => {
        function Cls(a, b) {
            this.a = a;
            this.b = b;
        }

        dic
            .value('a', 1)
            .value('b', 2) // eslint-disable-line no-magic-numbers
            .service('cls', Cls);

        const obj = dic.get('cls');
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(2); // eslint-disable-line no-magic-numbers
    });

    it('handles services with defined dependencies', () => {
        function Cls(a, b) {
            this.a = a;
            this.b = b;
        }

        dic
            .value('_a', 1)
            .value('_b', 2) // eslint-disable-line no-magic-numbers
            .service('cls', ['_a', '_b', Cls]);

        const obj = dic.get('cls');
        expect(obj.a).toBe(1);
        expect(obj.b).toBe(2); // eslint-disable-line no-magic-numbers
    });

    it('get returns always the same instance for services', () => {
        function Cls() {

        }

        dic.factory('cls', Cls);

        const a = dic.get('cls');
        const b = dic.get('cls');
        expect(a).toBe(b);
    });

    it('throws exception if service is not registered', () => {
        expect(() => {
            dic.get('a');
        }).toThrow(new Error('a is not registered in container'));
    });

    it('throws exception if service is not registered', () => {
        expect(() => {
            dic.factory('b', (a) => {
                return a;
            })
                .get('b');
        }).toThrow(new Error('a <- b is not registered in container'));
    });

    it('throws circular dependency', () => {
        expect(() => {
            dic
                .factory('a', (b) => {
                    return b;
                })
                .factory('b', (c) => {
                    return c;
                })
                .factory('c', (a) => {
                    return a;
                });

            dic.get('b');
        }).toThrow(new Error('Circular dependency detected: b <- c <- a <- b'));
    });

    it('can depend on one service multiple times', () => {
        dic
            .factory('a', () => {})
            .factory('b', (a) => {
                return a;
            })
            .factory('c', (b) => {
                return b;
            })
            .factory('d', (b, c) => {
                return c;
            });

        dic.get('d');
    });

    it('validates input for factory', () => {
        expect(() => {
            dic.factory('a', 1);
        }).toThrow(new Error('a: second argument should be an array or function'));
    });

    it('validates input for service', () => {
        expect(() => {
            dic.service('a', 1);
        }).toThrow(new Error('a: second argument should be an array or function'));
    });

    it('has a shortcut for get', () => {
        function C() {
            this.value = 3; // eslint-disable-line no-magic-numbers
        }

        dic.value('a', 1);
        dic.factory('b', () => {
            return 2; // eslint-disable-line no-magic-numbers
        });
        dic.service('c', C);

        expect(dic.a).toBe(1);
        expect(dic.b).toBe(2); // eslint-disable-line no-magic-numbers
        expect(dic.c.value).toBe(3); // eslint-disable-line no-magic-numbers
    });
});
