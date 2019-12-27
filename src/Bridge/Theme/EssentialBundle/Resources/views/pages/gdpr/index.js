import Bridge from '@components/scripts/base/Bridge';
import services from '@components/scripts/services';
import HeaderLight from '@components/views/header/light';
import TechnicalTracking from '@components/views/technical/tracking';

require('@theme/views/pages/gdpr/style.scss');

const modules = {
    gdpr: {
        tracking: {selector: '#lf-body', provider: TechnicalTracking},
        headerLight: {selector: '#lf-header-light', provider: HeaderLight}
    }
};

// Export bridge to the global namespace to make it available in the Twig templates
window.bridge = new Bridge(modules, services);
