<?php

namespace Bridge\FrontBundle\Controller;

use Bridge\FrontCoreBundle\Controller\AbstractController;
use Bridge\FrontApiBundle\Services\Search\AlgoliaSearchService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\Form\FormInterface;
use Symfony\Component\Form\FormView;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use GuzzleHttp\Promise as GuzzlePromise;

/**
 * Class FrontController
 *
 * @package Bridge\FrontBundle\Controller
 */
class FrontController extends AbstractController
{
    /**
     * @Route("/", name="home")
     * @Method({"GET", "POST"})
     * @Cache(smaxage=300)
     *
     * @return Response A Response instance
     */
    public function homeAction(Request $request)
    {
        $this->setGlobals();
        $searchSettingService = $this->getSearchSettingsResource();
        $topCitiesService = $this->getTopCitiesResource();

        $groupBy = $this->getParameter('bridge_front_starter_kit.footer_seo.home.group_by');
        $citiesNumber = $this->getParameter('bridge_front_starter_kit.footer_seo.home.cities_number');

        $promises = array_merge([
            'topCities'  => $topCitiesService->getTopCitiesAsync($groupBy, [], $citiesNumber),
            'searchSetting'  => $searchSettingService->getSearchSettingAsync(),
            'zones' => $this->loadZones($request, 'home')
        ]);

        $this->getViewParametersService()->setJsComponents([
            'autocomplete' => [
                'algoliaIndexName' => $this->getDomainConfigsService()->getAlgoliaIndexName()
            ]
        ]);

        $results = GuzzlePromise\all($promises)->wait();

        return $this->render('@pages/home/template.html.twig', [
            'zones' => $results['zones'],
            'topCities' => $results['topCities'],
            'searchSetting' => $results['searchSetting'],
            'seoPrefix' => $this->getSeoPrefix()
        ]);
    }

    /**
     * @param Request $request The request
     *
     * @Route("/search", name="search")
     * @Method({"GET", "POST"})
     * @Cache(smaxage=300)
     *
     * @return Response A Response instance
     */
    public function searchAction(Request $request)
    {
        $this->setGlobals();

        $page = (int) htmlspecialchars($request->query->get('page', 1));
        if ($page === 0) {
            $page = 1;
        }

        $query = htmlspecialchars($request->query->get('query'));
        $lat = htmlspecialchars($request->query->get('lat'));
        $lon = htmlspecialchars($request->query->get('lon'));
        $queryFilters = $request->query->get('filters');

        $searchSettingService = $this->getSearchSettingsResource();

        /**
         * @var AlgoliaSearchService $searchService
         */
        $searchService = $this->getSearchService();

        $promises = [
            'searchSetting' => $searchSettingService->getSearchSettingAsync(),
            'zones' => $this->loadZones($request, 'list')
        ];

        $results = GuzzlePromise\all($promises)->wait();

        $tags = $searchSettingService->extractParametersLabelsFromSearchParameters($queryFilters, $results['searchSetting']);

        $filters = $searchService->createFiltersFromTags($tags);
        $defaultCountries = $this->getParameter('bridge_front_starter_kit.search.country');
        $searchedCountries = $request->query->get('country', $defaultCountries);
        if (!is_array($searchedCountries)) {
            $searchedCountries = [$searchedCountries];
        }
        $filters = $searchService->appendToFilters(
            $filters,
            'localisation.country.code',
            $searchedCountries
        );

        $locations = $searchService->searchLocations(
            $lat,
            $lon,
            $query,
            [
                'filters' => $filters,
                'aroundRadius' => $this->getParameter('bridge_front_starter_kit.search.radius'),
                'hitsPerPage' => $this->getParameter('bridge_front_starter_kit.pagination'),
                'page' => $page - 1 // Starting at 0
            ],
            [
                'country' => implode(',', $searchedCountries)
            ]
        );

        $pagination = $this->getPagination($request, $locations);

        $this->getViewParametersService()->setJsComponents([
            'map' => [
                'locale' => $request->getLocale(),
                'locations' => $this->extractGeocodedLocations($locations),
                'pagination' => $pagination
            ],
            'infowindow' => [
                'infowindowUrl' => $this->generateUrl('infowindow')
            ],
            'tracking', [
                'parameters' => [
                    'query' => $query,
                    'count' => $locations->total
                ]
            ],
            'autocomplete' => [
                'algoliaIndexName' => $this->getDomainConfigsService()->getAlgoliaIndexName()
            ]
        ]);

        return $this->render('@pages/results/template.html.twig', [
            'locations' => $locations,
            'query' => $query,
            'latitude' => $lat,
            'longitude' => $lon,
            'pagination' => $pagination,
            'zones' => $results['zones'],
            'searchSetting' => $results['searchSetting'],
            'queryFilters' => $queryFilters
        ]);
    }

    /**
     * @Route("/gdpr/{pageName}", name="gdpr")
     * @Method({"GET"})
     * @Cache(smaxage=300)
     *
     * @return Response A Response instance
     */
    public function gdprAction($pageName)
    {
        if ($pageName == 'legal' or $pageName == 'cookies' or $pageName == 'protection') {
            return $this->render('@pages/gdpr/template.html.twig', [
                'pageName' => $pageName
            ]);
        }
        throw $this->createNotFoundException();
    }


    /**
     * @param string $seoId
     * @param string $slug
     *
     * @Route(
     *     "/{seoId}",
     *     name="locations_no_slug",
     *     requirements={"seoId": "^[1-9][0-9]*$"}
     * )
     * @Route(
     *     "/{seoId}-{slug}",
     *     name="locations",
     *     requirements={"seoId": "^[1-9][0-9]*$"}
     * )
     * @Method({"GET", "POST"})
     * @Cache(smaxage=300)
     *
     * @return Response A Response instance
     */
    public function locationAction(Request $request, $seoId, $slug = null)
    {
        $this->setGlobals();
        $locationService = $this->getLocationsResource();
        $searchSettingService = $this->getSearchSettingsResource();
        $clientsService = $this->getClientsResource();
        $client = $clientsService->getClient();
        $closestLocations = null;

        $locationPromise = $locationService->getLocationBySeoIdAsync($seoId);

        $location = $locationPromise->wait();

        if (!$location || !$location->hasStoreLocatorPage) {
            throw $this->createNotFoundException();
        }

        $locationSlug = $location->slug;

        if ($slug !== $locationSlug) {
            return $this->redirectToRoute('locations', array('seoId' => $seoId, 'slug' => $locationSlug), 301);
        }

        if (!$location->active) {
            $closestLocations = $this->getClosestLocations($location, 6);
        }

        $this->getBreadcrumbsService()->setFromLocation($this->getSeoPrefix(), $location);

        $this->getViewParametersService()->setJsComponents([
            'map' => [
                'locale' => $request->getLocale(),
                'locations' => [$location]
            ],
            'tracking' => [
                'parameters' => [
                    'location' => [
                        'id' => $location->seoId,
                        'name' => $location->name
                    ]
                ]
            ],
            'autocomplete' => [
                'algoliaIndexName' => $this->getDomainConfigsService()->getAlgoliaIndexName(),
            ]
        ]);

        $promises = [
            'searchSettings' => $searchSettingService->getSearchSettingAsync(),
            'zones' => $this->loadZones($request, 'location', ['locationId' => $location->_id])
        ];

        $results = GuzzlePromise\all($promises)->wait();
        $clientModules = $this->getActivatedModules($client);

        if ($clientModules->leads) {
            $contactFormPromise = $this->getBridgeFormAsync('default-contact-form', $location);
        }

        $citiesNumber = $this->getParameter('bridge_front_starter_kit.footer_seo.location.cities_number');

        $twigParams = [
            'location' => $location,
            'zones' =>  $results['zones'],
            'locationAddressForm' => $this->buildLocationAddressView($location),
            'searchSetting' => $results['searchSettings'],
            'closestLocations' => $closestLocations,
            'closestCities' => $this->getClosestCities($location, $citiesNumber),
            'seoPrefix' => $this->getSeoPrefix(),
            'newsletterForm' => null,
            'contactForm' => null
        ];

        if ($clientModules->leads) {
            $twigParams['contactForm'] = $contactFormPromise->wait();
        }
        if ($clientModules->newsletter) {
            $twigParams['newsletterForm'] = $this->getNewsletterForm($location);
        }

        return $this->render('@pages/location/template.html.twig', $twigParams);
    }

    /**
    * @param object     Client structure from API
    * @return object    Structure that defines the activated modules
    */
    private function getActivatedModules($client)
    {
        return (object) [
            'leads' => $this->isActivatedModule($client, 'leads'),
            'newsletter' => $this->isActivatedModule($client, 'newsletter')
        ];
    }

    /**
    * @param object Client structure from API
    * @param string Module name
    * @return bool   True when module is activated for the client
    */
    private function isActivatedModule($client, $moduleName)
    {
        return isset($client->modules->$moduleName) ? $client->modules->$moduleName->getActivated() : false;
    }

    /**
     * @param Bridge\FrontApiBundle\Model\Location\Location
     *
     * @return \Symfony\Component\Form\FormInterface
     */
    private function getNewsletterForm($location)
    {
        $formFactory = $this->get('form.factory');
        $formBuilder = $formFactory->createNamedBuilder('location-newsletter-subscribe-form', FormType::class, null, array(
            'action' => $this->generateUrl('newsletter_subscribe'),
            'method' => 'POST'
        ));

        $formBuilder->add('bridge-user-email', EmailType::class, array(
            'required' => true
        ));

        $formBuilder->add('bridge-location-id', HiddenType::class, array(
            'data' => $location->_id
        ));
        $formBuilder->add('bridge-subscribe', SubmitType::class);

        return $formBuilder->getForm()->createView();
    }

    /**
     * @param string $request
     * @param string $countryCode
     * @param string $division0
     * @param string $division1
     *
     * @Route(
     *     "/{countryCode}/{division0}/{division1}",
     *     requirements={
     *         "countryCode": "[a-zA-Z]{2}"
     *     },
     *     name="geo_divisions"
     * )
     * @Method({"GET", "POST"})
     * @Cache(smaxage=300)
     *
     * @return Response A Response instance
     */
    public function geoDivisionsCountryAction(Request $request, $countryCode, $division0 = null, $division1 = null)
    {
        $this->setGlobals();

        $page = $request->query->getInt('page', 1);
        if ($page === 0) {
            $page = 1;
        }
        /**
         * @var AlgoliaSearchService $searchService
         */
        $searchService = $this->getSearchService();
        $search = $searchService->getFacetingDivision($countryCode, $division0, $division1, [
            'hitsPerPage' => $this->getParameter('bridge_front_starter_kit.pagination'),
            'page' => $page - 1
        ]);

        $index = count(array_filter(func_get_args())) - 2;
        $template = ['countries', 'division0', 'division1'][$index];

        $this->getViewParametersService()->setJsComponents([
            'tracking' => [
                'parameters' => [
                    'page' => 'geo-divisions-' . $template
                ]
            ]
        ]);

        $query = func_get_args()[$index];

        $topCitiesService = $this->getTopCitiesResource();
        $citiesNumber = $this->getParameter('bridge_front_starter_kit.footer_seo.geo_divisions.cities_number');

        if ($division1) {
            $topCities = $topCitiesService->getTopCities('city', ['division1' => $division1], $citiesNumber);
        } elseif ($division0) {
            $topCities = $topCitiesService->getTopCities('division1', ['division0' => $division0], $citiesNumber);
        } elseif ($countryCode) {
            $topCities = $topCitiesService->getTopCities('division0', ['country' => strtoupper($countryCode)], $citiesNumber);
        }

        return $this->renderGeoDivisions($request, $template, $search, $query, $topCities);
    }

    /**
     * @param Request $request     The request
     * @param string  $seoPrefix
     * @param string  $countryCode
     * @param string  $cityName
     *
     * @Route(
     *     "/{seoPrefix}/{countryCode}/{cityName}",
     *     requirements={
     *         "countryCode": "[a-zA-Z]{2}"
     *     },
     *     name="geo_cities"
     * )
     * @Method({"GET", "POST"})
     * @Cache(smaxage=300)
     *
     * @return Response A Response instance
     */
    public function geoDivisionsCityAction(Request $request, $seoPrefix, $countryCode, $cityName)
    {
        $this->setGlobals();

        $page = $request->query->getInt('page', 1);
        if ($page === 0) {
            $page = 1;
        }

        /**
         * @var AlgoliaSearchService $searchService
         */
        $searchService = $this->getSearchService();
        $search = $searchService->getFacetingCities($countryCode, $cityName, [
            'hitsPerPage' => $this->getParameter('bridge_front_starter_kit.pagination'),
            'page' => $page - 1
        ]);

        return $this->renderGeoDivisions($request, 'cities', $search, $cityName, null, $seoPrefix);
    }

    /**
     * @param $request
     * @param $template
     * @param $search
     * @param $query
     * @param $prefix |null
     *
     * @return Response
     */
    protected function renderGeoDivisions($request, $template, $search, $query, $topCities = null, $seoPrefix = null)
    {
        if ($search->total === 0) {
            throw $this->createNotFoundException();
        }

        if (null === $seoPrefix || '' === $seoPrefix) {
            $seoPrefix = $this->getSeoPrefix();
        }

        $location = $search->getRows()[0];
        $localisation = clone $location->localisation;
        $searchSettingService = $this->getSearchSettingsResource();

        $this->getBreadcrumbsService()->setFromLocation($this->getSeoPrefix(), $location);

        $pagination = $this->getPagination($request, $search);

        $this->getViewParametersService()->setJsComponents([
            'autocomplete' => [
                'algoliaIndexName' => $this->getDomainConfigsService()->getAlgoliaIndexName()
            ]
        ]);

        $citiesNumber = $this->getParameter('bridge_front_starter_kit.footer_seo.geo_divisions.cities_number');

        if (null === $topCities) {
            $topCitiesService = $this->getTopCitiesResource();
            $topCities = $topCitiesService->getTopCities(
                'city',
                [
                    'division1' => $location->localisation->division1->slug
                ],
                $citiesNumber
            );
        }

        return $this->render("@pages/geo-divisions/$template/template.html.twig", [
            'seoPrefix' => $seoPrefix,
            'localisation' => $localisation,
            'pagination' => $pagination,
            'division' => $template,
            'search' => $search,
            'query' => $query,
            'jsModuleName' => 'geoDivisions',
            'topCities' => $topCities,
            'searchSetting' => $searchSettingService->getSearchSetting(),
            'closestCities' => $this->getClosestCities($location, $citiesNumber)
        ]);
    }

    /**
     * @param Request $request The request
     *
     * @Method("POST")
     * @Route("/infowindow", name="infowindow")
     *
     * @return Response A Response instance
     */
    public function infowindowAction(Request $request)
    {
        $locationService = $this->getLocationsResource();

        $results = $this->getJsonBody($request);

        $seoId = $results['seoId'];
        $locationPromise = $locationService->getLocationBySeoIdAsync($seoId);
        $location = $locationPromise->wait();

        $locationView = $this->renderView('@components/map/infowindow/template.html.twig', [
            'location' => $location
        ]);

        return new Response($locationView);
    }

    protected function setGlobals()
    {
        $this->getViewParametersService()
            ->setJsComponents([
                'geolocation' => [
                    'searchUrlTemplate' => $this->generateUrl('search')
                ]
            ])
            ->setJsServices([
                'ajaxService' => [
                    'urls' => [
                        'searchText' => $this->generateUrl('location_search_text'),
                        'searchCoordinates' => $this->generateUrl('location_search_coordinates'),
                        'searchCustom' => $this->generateUrl('location_search_custom')
                    ]
                ]
            ]);
    }

    protected function getPagination($request, $results)
    {
        $url = $request->getUri();

        $current = $results->page + 1;
        $first = 1;
        $last = $results->nbPages;

        $prevUrl = null;
        $nextUrl = null;

        $firstUrl = $this->getHttpsUrl(Request::create($url, 'GET', array('page' => null))->getUri());
        $lastUrl = $this->getHttpsUrl(Request::create($url, 'GET', array('page' => $last))->getUri());

        if ($current > 1) {
            $prevUrl = $this->getHttpsUrl(Request::create($url, 'GET', array('page' => $results->page))->getUri());
        }

        if ($current < $last) {
            $nextUrl = $this->getHttpsUrl(Request::create($url, 'GET', array('page' => $results->page + 2))->getUri());
        }

        $links = [];
        $range = null;
        switch ($current) {
            case $first:
                $range = range(0, 4);
                break;

            case $first + 1:
                $range = range(-1, 3);
                break;

            case $last - 1:
                $range = range(-3, 1);
                break;

            case $last:
                $range = range(-4, 0);
                break;

            default:
                $range = range(-2, 2);
                break;
        }

        foreach ($range as $i) {
            if ($current + $i < $last + 1 && $current + $i > 0) {
                $links[$current + $i] = $this->getHttpsUrl(Request::create($url, 'GET', array('page' => $current + $i))->getUri());
            }
        }

        return [
            'isPagination' => $last > 1,
            'hitsStart' => $results->page * $results->hitsPerPage + 1,
            'hitsEnd' => min(($current) * $results->hitsPerPage, $results->total),
            'hitsTotal' => $results->total,
            'hitsPerPage' => $results->hitsPerPage,
            'first' => $first,
            'firstUrl' => $firstUrl,
            'prevUrl' => $prevUrl,
            'current' => $current,
            'nextUrl' => $nextUrl,
            'last' => $last,
            'lastUrl' => $lastUrl,
            'links' => $links
        ];
    }

    protected function getHttpsUrl($url)
    {
        if ($this->container->getParameter("kernel.environment") === 'prod') {
            return str_replace('http://', 'https://', $url);
        }

        return $url;
    }

    protected function getClosestLocations($location, $hitsPerPage = 1000)
    {
        /**
         * @var AlgoliaSearchService $searchService
         */
        $searchService = $this->getSearchService();

        if (isset($location->localisation->coordinates->latitude)
            and isset($location->localisation->coordinates->longitude)) {
            $locationCoordinates = [
                'latitude' => $location->localisation->coordinates->latitude,
                'longitude' => $location->localisation->coordinates->longitude
            ];

            $searchRadius = $this->getParameter('bridge_front_starter_kit.search.radius');

            return $searchService->searchGeoloc(
                $locationCoordinates['latitude'],
                $locationCoordinates['longitude'],
                [
                    'hitsPerPage' => $hitsPerPage, //Algolia max in August 2017
                    'aroundRadius' => $searchRadius
                ]
            )->getRows();
        }

        return [];
    }

    protected function getClosestCities($location, $hitsPerPage)
    {
        $closestLocations = $this->getClosestLocations($location);
        $sortedArray = [];
        $locationSlug = $location->localisation->city->slug ?? '';

        foreach ($closestLocations as $loc) {
            $slug = $loc->localisation->city->slug ?? '';
            if ($slug !== $locationSlug) {
                $sortedArray[$slug] = $loc;
            }

            if (count($sortedArray) >= $hitsPerPage) {
                return $sortedArray;
            }
        }
        return $sortedArray;
    }

    /**
     * @param $location
     * @return FormView
     */
    private function buildLocationAddressView($location): FormView
    {
        /** @var $form FormInterface*/
        $form = $this->getLocationAddressForm()->getForm();
        $form->get('bridge-location-id')->setData($location->_id);
        $url = $this->generateUrl('locations', array('seoId' => $location->seoId), UrlGeneratorInterface::ABSOLUTE_URL);
        $form->get('bridge-location-url')->setData($url);
        $form->get('bridge-phone-default-country')->setData($this->getParameter('bridge_front_starter_kit.forms.location_address.default_phone_country'));
        return $form->createView();
    }

    /**
     * @param Request $request the request
     * @param String $page
     * @param Array $default default config applied to all zones
     * @return Array array of GuzzleHttp\Promise
     */
    private function loadZones(Request $request, $page, $defaults = [])
    {
        $publicationService = $this->getPublicationsResource();
        $zones = $this->getThemeZones($request);

        foreach ($zones as $zone => $conf) {
            $zones[$zone] = array_merge($defaults, $conf);
        }

        return GuzzlePromise\all($publicationService->getPublicationsByZonesAsync($page, $zones));
    }
}
