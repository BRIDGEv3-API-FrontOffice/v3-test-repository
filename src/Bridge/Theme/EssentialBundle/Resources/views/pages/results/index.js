import Bridge from '@components/scripts/base/Bridge';
import Lazyload from '@components/scripts/modules/common/lazyload';
import MapInteraction from '@components/scripts/modules/results/map';
import services from '@components/scripts/services';
import AutocompleteAlgolia from '@components/views/autocomplete/algolia';
import HeaderLight from '@components/views/header/light';
import Location from '@components/views/location/default';
import Map from '@components/views/map/default';
import Infowindow from '@components/views/map/infowindow';
import Itinerary from '@components/views/parts/itinerary';
import Phone from '@components/views/parts/phone';
import SearchDefault from '@components/views/search/default';
import SearchFilters from '@components/views/search/filters';
import GeolocationSearch from '@components/views/search/geolocation';
import TechnicalTracking from '@components/views/technical/tracking';
import ResultsLayout from '@theme/scripts/modules/results/layout';
import ResultList from '@components/scripts/modules/results/wcag/resultList';

require('@theme/views/pages/results/style.scss');

const modules = {
    results: {
        tracking: {selector: '#lf-body', provider: TechnicalTracking},
        resultsLayout: {selector: '#lf-results', provider: ResultsLayout},
        lazyload: {selector: 'body', provider: Lazyload},
        headerLight: {selector: '#lf-header-light', provider: HeaderLight},
        itinerary: {selector: '[data-lf-itinerary]', provider: Itinerary},
        phone: {selector: '[data-lf-phone]', provider: Phone},
        location: {selector: '[data-lf-location]', provider: Location},
        map: {selector: '#lf-map', provider: Map},
        infowindow: {selector: '#lf-map-infowindow', provider: Infowindow},
        mapInteraction: {selector: '#lf-results-main', provider: MapInteraction},
        geolocation: {selector: '#lf-search-geolocation', provider: GeolocationSearch},
        searchFilters: {selector: '#lf-search-filters', provider: SearchFilters},
        searchDefault: {selector: '#lf-search-default', provider: SearchDefault},
        autocomplete: {selector: '#lf-search-form', provider: AutocompleteAlgolia},
        resultList: {selector: '[data-lf-list]', provider: ResultList}
    }
};

// Export bridge to the global namespace to make it available in the Twig templates
window.bridge = new Bridge(modules, services);
