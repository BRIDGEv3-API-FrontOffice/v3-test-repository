import Bridge from '@components/scripts/base/Bridge';
import Component from '@components/scripts/base/Component';
import DependencyInjector from '@components/scripts/base/DependencyInjector';
import GlobalsService from '@components/scripts/services/globals';

describe('src/Bridge/ComponentsBundle/Resources/scripts/base/Bridge.js', () => {
    describe('constructor', () => {
        it('should instantiate the class', () => {
            const instance = new Bridge();
            expect(instance.container instanceof DependencyInjector).toBe(true);
            expect(instance.modules).toEqual({});
            expect(instance.services).toEqual({});
            expect(instance.configService).toEqual(null);
        });
    });

    describe('setModule', () => {
        it('should set a module', () => {
            const bridge = new Bridge();
            const name = 'myModule';
            const components = {};
            const instance = bridge.setModule(name, components);
            expect(bridge.modules[name]).toBe(components);
            expect(instance).toBe(bridge);
        });
    });

    describe('setService', () => {
        it('should set a service', () => {
            const bridge = new Bridge();
            const name = 'myService';
            const service = {};
            const instance = bridge.setService(name, service);
            expect(bridge.services[name]).toBe(service);
            expect(instance).toBe(bridge);
        });
    });

    describe('bootstrap', () => {
        let config;
        let modules;
        let services;

        beforeEach(() => {
            const globals = { name: 'test' };
            config = {
                globals: globals,
                services: {},
                components: {}
            };
            modules = {
                myModule: {}
            };
            services = {};
        });

        function bootstrap() {
            const bridge = new Bridge(modules, services);
            bridge.bootstrap('myModule', config);
            return bridge;
        }

        it('should throw an error if the module is not defined', () => {
            const bridge = new Bridge();
            expect(() => {
                bridge.bootstrap();
            }).toThrow(jasmine.any(Error));
        });

        it('should bootstrap the config', () => {
            const bridge = bootstrap();
            expect(bridge.configService instanceof GlobalsService).toBe(true);
            expect(bridge.configService.get('name')).toBe('test');
        });

        describe('services', () => {
            it('should initialize a simple service', () => {
                class MyService {
                    init() { }
                }

                const serviceConstructor = jasmine.createSpy('MyService').and.callFake((conf) => {
                    const service = new MyService(conf);
                    spyOn(service, 'init');
                    return service;
                });

                services = { myService: serviceConstructor };

                const bridge = bootstrap();
                const buildedService = bridge.container.get('myService');

                expect(services.myService).toHaveBeenCalled();
                expect(buildedService.init).toHaveBeenCalled();
            });

            it('should initialize a simple service with configuration', () => {
                class MyService {
                    constructor(conf) {
                        this.config = conf;
                    }
                    init() {}
                }
                config.services.myService = { name: 'test' };
                services = { myService: MyService };
                const bridge = bootstrap();
                const buildedService = bridge.container.get('myService');

                expect(buildedService.config).toBe(config.services.myService);
            });

            it('should initialize a simple service with dependencies', () => {
                class MyService {
                    constructor(conf) {
                        this.config = conf;
                    }

                    init(globalsService) {
                        this.globals = globalsService;
                    }
                }
                MyService.deps = ['globalsService'];

                services = { myService: MyService };

                const bridge = bootstrap();
                const buildedService = bridge.container.get('myService');

                expect(buildedService.globals instanceof GlobalsService).toBe(true);
            });

            it('should initialize a simple service without init method', () => {
                class MyService {
                    constructor(conf) {
                        this.config = conf;
                    }
                }

                services = { myService: MyService };

                const bridge = bootstrap();
                const buildedService = bridge.container.get('myService');

                expect(buildedService instanceof MyService).toBe(true);
            });
        });

        describe('components', () => {
            beforeEach(() => {
                jasmine.getFixtures().set('<div id="myComponent"></div>');
            });

            it('should initialize a component', () => {
                class MyComponent extends Component {
                    init() {
                        this.el.innerHTML = 'test content';
                    }
                }

                const componentConstructor = jasmine.createSpy('MyConstructor').and.callFake((conf) => {
                    return new MyComponent(conf);
                });

                modules.myModule.myComponent = { selector: '#myComponent', provider: componentConstructor};

                bootstrap();
                expect(componentConstructor).toHaveBeenCalled();
                expect(document.querySelector('#myComponent')).toContainText('test content');
            });

            it('should pass configuration to component', () => {
                class MyComponent extends Component {
                    getDefaultAttributes() {
                        return { content: '' };
                    }

                    init() {
                        this.el.innerHTML = this.attr.content;
                    }
                }

                modules.myModule.myComponent = { selector: '#myComponent', provider: MyComponent};
                config.components.myComponent = { content: 'Custom Content'};

                bootstrap();
                expect(document.querySelector('#myComponent')).toContainText('Custom Content');
            });

            it('should inject dependencies to components', () => {
                class MyComponent extends Component {
                    init(globalsService) {
                        this.el.innerHTML = globalsService.get('client').name;
                    }
                }

                MyComponent.deps = ['globalsService'];
                modules.myModule.myComponent = { selector: '#myComponent', provider: MyComponent};
                config.globals.client = { name: 'Leadformance'};

                bootstrap();
                expect(document.querySelector('#myComponent')).toContainText('Leadformance');
            });
        });
    });
});
