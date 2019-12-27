import Bridge from '@components/scripts/base/Bridge';
import Forms from '@components/scripts/modules/common/forms';
import Lazyload from '@components/scripts/modules/common/lazyload';
import Micromodal from '@components/scripts/modules/common/micromodal';
import services from '@components/scripts/services';
import AutocompleteAlgolia from '@components/views/autocomplete/algolia';
import BreadcrumbScroll from '@components/views/breadcrumb/scroll';
import FooterSeo from '@components/views/footer/seo';
import HeaderLight from '@components/views/header/light';
import Map from '@components/views/map/default';
import OffersDefault from '@components/views/offers/default';
import OffersIcon from '@components/views/offers/icon';
import OffersSlider from '@components/views/offers/slider';
import Fax from '@components/views/parts/fax';
import Itinerary from '@components/views/parts/itinerary';
import Media from '@components/views/parts/media';
import OpeningHours from '@components/views/parts/openingHours';
import Phone from '@components/views/parts/phone';
import Presentation from '@components/views/presentation/default';
import PublicationsBannersDefault from '@components/views/publications/banners/default';
import PublicationsNewsDefault from '@components/views/publications/news/default';
import SearchDefault from '@components/views/search/default';
import SearchFilters from '@components/views/search/filters';
import GeolocationSearch from '@components/views/search/geolocation';
import TechnicalTracking from '@components/views/technical/tracking';
import LocationLayout from '@theme/scripts/modules/location/layout';

require('@theme/views/pages/location/style.scss');

const modules = {
    locations: {
        tracking: {selector: '#lf-body', provider: TechnicalTracking},
        locationLayout: {selector: '#lf-location', provider: LocationLayout},
        lazyload: {selector: 'body', provider: Lazyload},
        initModal: {selector: 'body', provider: Micromodal},
        headerLight: {selector: '#lf-header-light', provider: HeaderLight},
        breadcrumb: {selector: '#lf-breadcrumb-scroll', provider: BreadcrumbScroll},
        footerSeo: {selector: '#lf-footer-seo', provider: FooterSeo},
        sliderMedia: {selector: '#lf-location-media', provider: Media},
        presentation: {selector: '#lf-presentation-default', provider: Presentation},
        sliderBanner: {selector: '#lf-publications-banners', provider: PublicationsBannersDefault},
        sliderNews: {selector: '#lf-publications-news', provider: PublicationsNewsDefault},
        sliderEvents: {selector: '#lf-publications-events', provider: PublicationsNewsDefault},
        itinerary: {selector: '[data-lf-itinerary]', provider: Itinerary},
        openingHours: {selector: '#lf-parts-opening-hours', provider: OpeningHours},
        phone: {selector: '[data-lf-phone]', provider: Phone},
        fax: {selector: '[data-lf-fax]', provider: Fax},
        map: {selector: '#lf-map', provider: Map},
        sliderOffer: {selector: '[data-lf-range-style="slider"]', provider: OffersSlider},
        defaultOffer: {selector: '[data-lf-range-style="default"]', provider: OffersDefault},
        iconOffer: {selector: '[data-lf-range-style="icon"]', provider: OffersIcon},
        geolocation: {selector: '#lf-search-geolocation', provider: GeolocationSearch},
        searchFilters: {selector: '#lf-search-filters', provider: SearchFilters},
        searchDefault: {selector: '#lf-search', provider: SearchDefault},
        autocomplete: {selector: '#lf-search-form', provider: AutocompleteAlgolia},
        contactForm: {selector: '#lf-forms-contact', provider: Forms},
        addressForm: {selector: '#lf-forms-address', provider: Forms},
        newsletterForm: {selector: '#lf-forms-newsletter', provider: Forms}
    }
};

// Export bridge to the global namespace to make it available in the Twig templates
window.bridge = new Bridge(modules, services);
