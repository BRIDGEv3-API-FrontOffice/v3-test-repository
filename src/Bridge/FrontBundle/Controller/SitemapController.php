<?php

namespace Bridge\FrontBundle\Controller;

use Bridge\FrontApiBundle\Services\Search\AlgoliaGeodivisionSearchService;
use Bridge\FrontApiBundle\Services\Search\AlgoliaSearchService;
use Bridge\FrontCoreBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class SitemapController
 * @package Bridge\FrontBundle\Controller
 * @Route("/")
 */
class SitemapController extends AbstractController
{
    const MAX_ENTRIES_PER_FILE = 10000;

    /**
     * @Route(
     *   "/sitemap.{_format}",
     *   name="root_sitemap",
     *   Requirements={"_format" = "xml"}
     * )
     * @Cache(smaxage=300)
     */
    public function sitemapAction()
    {
        /**
         * @var AlgoliaGeodivisionSearchService $geoSearchService
         */
        $geoSearchService = $this->getGeodivisionSearchService();

        $nbLocations = $geoSearchService->getLocationsCount('hasStoreLocatorPage=1');

        $nbLocationsSitemap = ceil($nbLocations / self::MAX_ENTRIES_PER_FILE);

        return $this->render('BridgeFrontBundle::sitemap/sitemap.xml.twig', [
            'nbLocationsSitemap' => $nbLocationsSitemap
        ]);
    }

    /**
     * @Route(
     *   "/mainsitemap.{_format}",
     *   name="main_sitemap",
     *   Requirements={"_format" = "xml"}
     * )
     * @Cache(smaxage=300)
     */
    public function mainSitemapAction()
    {
        return $this->render(
            'BridgeFrontBundle::sitemap/main-sitemap.xml.twig',
            [
                'geodivisionPages' => $this->getGeoDivisionParameters(),
                'topCities' => $this->getTopCities(),
                'seoPrefix' => $this->getSeoPrefix()
            ]
        );
    }

    /**
     * @Route(
     *   "/locationsitemap{index}.{_format}",
     *   name="locations_sitemap",
     *   Requirements={"_format" = "xml", "index": "^[1-9][0-9]*$"}
     * )
     * @Cache(smaxage=300)
     */
    public function locationsSitemapAction(Request $request, $index)
    {
        $locations = $this->getLocationsResource()->searchLocations(
            ['hasStoreLocatorPage' => true],
            self::MAX_ENTRIES_PER_FILE,
            [],
            $index,
            [
                'hasStoreLocatorPage' => 1,
                'website' => 1,
                'updatedAt' => 1,
                'slug' => 1,
                'seoId' => 1,
            ]
        )->getRows();

        if (empty($locations)) {
            throw $this->createNotFoundException(
                $this
                    ->get('translator')
                    ->trans('bridge.front_bundle.views.exceptions.error-404.title', array(), 'errors')
            );
        }

        return $this->render('BridgeFrontBundle::sitemap/locations-sitemap.xml.twig', [
            'locale' => $request->getLocale(),
            'locations' => $locations
        ]);
    }

    private function getGeoDivisionParameters()
    {
        /**
         * @var AlgoliaGeodivisionSearchService $geoSearchService
         */
        $geoSearchService = $this->getGeodivisionSearchService();

        $uriParameters = array();

        $countries = $geoSearchService->getCountries(self::MAX_ENTRIES_PER_FILE);

        foreach (array_keys($countries) as $country) {
            array_push(
                $uriParameters,
                [
                    'countryCode' => strtolower($country),
                    'division0' => '',
                    'division1' => ''
                ]
            );

            $uriParameters = array_merge(
                $uriParameters,
                $this->getDivisionsUriParameters(strtolower($country))
            );
        }

        return $uriParameters;
    }

    private function getDivisionsUriParameters($country)
    {
        /**
         * @var AlgoliaGeodivisionSearchService $geoSearchService
         */
        $geoSearchService = $this->getGeodivisionSearchService();

        $uriParameters = array();

        $geodivs0 = $geoSearchService->getDivision0(
            $country,
            self::MAX_ENTRIES_PER_FILE
        );

        foreach (array_keys($geodivs0) as $geodiv0) {
            array_push(
                $uriParameters,
                [
                    'countryCode' => $country,
                    'division0' => $geodiv0,
                    'division1' => ''
                ]
            );

            $uriParameters = array_merge(
                $uriParameters,
                $this->getDivision1UriParameters($country, $geodiv0)
            );
        }

        return $uriParameters;
    }

    private function getDivision1UriParameters($country, $division0)
    {
        /**
         * @var AlgoliaGeodivisionSearchService $geoSearchService
         */
        $geoSearchService = $this->getGeodivisionSearchService();

        $uriParameters = array();

        $geodivs1 = $geoSearchService->getDivision1(
            $division0,
            self::MAX_ENTRIES_PER_FILE
        );

        foreach (array_keys($geodivs1) as $geodiv1) {
            array_push(
                $uriParameters,
                [
                    'countryCode' => $country,
                    'division0' => $division0,
                    'division1' => $geodiv1
                ]
            );
        }

        return $uriParameters;
    }

    private function getTopCities()
    {
        $topCities = [];

        $internalTopCities = $this->getTopCitiesResource()->getTopCities('city', [], self::MAX_ENTRIES_PER_FILE);

        foreach ($internalTopCities->citiesGroup[0] as $topCity) {
            $topCities[] = [
                'countryCode' => $topCity->country->code,
                'slug' => $topCity->slug
            ];
        }
        return $topCities;
    }
}
