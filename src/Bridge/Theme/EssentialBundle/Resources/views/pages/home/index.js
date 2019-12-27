import Bridge from '@components/scripts/base/Bridge';
import Lazyload from '@components/scripts/modules/common/lazyload';
import services from '@components/scripts/services';
import AutocompleteAlgolia from '@components/views/autocomplete/algolia';
import FooterSeo from '@components/views/footer/seo';
import HeaderLight from '@components/views/header/light';
import ExpandHeader from '@components/views/header/optimum';
import PublicationsBannersDefault from '@components/views/publications/banners/default';
import PublicationsNewsDefault from '@components/views/publications/news/default';
import GeolocationSearch from '@components/views/search/geolocation';
import TechnicalTracking from '@components/views/technical/tracking';

require('@theme/views/pages/home/style.scss');

const modules = {
    home: {
        tracking: {selector: '#lf-body', provider: TechnicalTracking},
        lazyload: {selector: 'body', provider: Lazyload},
        headerLight: {selector: '#lf-header-light', provider: HeaderLight},
        sliderBanner: {selector: '#lf-publications-banners', provider: PublicationsBannersDefault},
        sliderNews: {selector: '#lf-publications-news', provider: PublicationsNewsDefault},
        sliderEvents: {selector: '#lf-publications-events', provider: PublicationsNewsDefault},
        footerSeo: {selector: '#lf-footer-seo', provider: FooterSeo},
        geolocation: {selector: '#lf-search-geolocation', provider: GeolocationSearch},
        expandHeader: {selector: '#header-optimum', provider: ExpandHeader},
        autocomplete: {selector: '#lf-search-form', provider: AutocompleteAlgolia}
    }
};

// Export bridge to the global namespace to make it available in the Twig templates
window.bridge = new Bridge(modules, services);
