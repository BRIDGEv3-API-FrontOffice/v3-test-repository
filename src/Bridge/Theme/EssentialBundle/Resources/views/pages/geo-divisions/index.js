import Bridge from '@components/scripts/base/Bridge';
import Lazyload from '@components/scripts/modules/common/lazyload';
import services from '@components/scripts/services';
import AutocompleteAlgolia from '@components/views/autocomplete/algolia';
import BreadcrumbScroll from '@components/views/breadcrumb/scroll';
import Facets from '@components/views/facets/default';
import FooterSeo from '@components/views/footer/seo';
import HeaderLight from '@components/views/header/light';
import Location from '@components/views/location/default';
import Itinerary from '@components/views/parts/itinerary';
import Phone from '@components/views/parts/phone';
import SearchDefault from '@components/views/search/default';
import SearchFilters from '@components/views/search/filters';
import GeolocationSearch from '@components/views/search/geolocation';
import TechnicalTracking from '@components/views/technical/tracking';

require('@theme/views/pages/geo-divisions/style.scss');

const modules = {
    geoDivisions: {
        tracking: {selector: '#lf-body', provider: TechnicalTracking},
        lazyload: {selector: 'body', provider: Lazyload},
        headerLight: {selector: '#lf-header-light', provider: HeaderLight},
        breadcrumb: {selector: '#lf-breadcrumb-scroll', provider: BreadcrumbScroll},
        footerSeo: {selector: '#lf-footer-seo', provider: FooterSeo},
        itinerary: {selector: '[data-lf-itinerary]', provider: Itinerary},
        phone: {selector: '[data-lf-phone]', provider: Phone},
        location: {selector: '[data-lf-location]', provider: Location},
        facets: {selector: '#lf-facets-default', provider: Facets},
        geolocation: {selector: '#lf-search-geolocation', provider: GeolocationSearch},
        searchFilters: {selector: '#lf-search-filters', provider: SearchFilters},
        searchDefault: {selector: '#lf-search', provider: SearchDefault},
        autocomplete: {selector: '#lf-search-form', provider: AutocompleteAlgolia}
    }
};

// Export bridge to the global namespace to make it available in the Twig templates
window.bridge = new Bridge(modules, services);
