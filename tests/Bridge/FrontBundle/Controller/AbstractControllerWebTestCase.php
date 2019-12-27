<?php

namespace Tests\Bridge\FrontBundle\Controller;

use Bridge\FrontApiBundle\Model\Client\Client;
use Bridge\FrontApiBundle\Model\Client\Module;
use Bridge\FrontApiBundle\Model\Form\Form;
use Bridge\FrontApiBundle\Model\Location\Coordinates;
use Bridge\FrontApiBundle\Model\Location\Localisation;
use Bridge\FrontApiBundle\Model\Location\Location;
use Bridge\FrontApiBundle\Model\Location\LocationSearch;
use Bridge\FrontApiBundle\Model\Publication\Publication;
use Bridge\FrontApiBundle\Model\Publication\PublicationSearch;
use Bridge\FrontApiBundle\Model\SearchSetting\SearchSetting;
use GuzzleHttp\Promise as GuzzlePromise;
use Symfony\Bundle\FrameworkBundle\Client as HttpClient;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\DependencyInjection\Container;
use Symfony\Component\HttpFoundation\Response;
use Tests\Bridge\FrontBundle\AccessibleTrait;

/**
 * Class AbstractControllerWebTestCase
 * @package Bridge\FrontCoreBundle\Utils
 */
abstract class AbstractControllerWebTestCase extends WebTestCase
{
    use AccessibleTrait;

    /**
     * @var Controller
     */
    protected $controller;

    /**
     * @var Container
     */
    protected $mockContainer;

    /**
     * @var HttpClient
     */
    protected $client;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $clientsResource;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $locationsResource;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $formsResource;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $publicationsResource;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $settingsResource;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $searchService;

    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $translationService;

    /**
     *
     */
    protected function setUp()
    {
        $this->client = static::createClient();

        $controllerClass = $this->getControllerClass();
        $isAbstractClass = new \ReflectionClass($controllerClass);

        if ($isAbstractClass) {
            $this->controller = $this->getMockForAbstractClass($controllerClass);
        } else {
            $this->controller = new $controllerClass();
        }

        $this->controller->setContainer($this->client->getKernel()->getContainer());

        $this->mockApiCalls();
    }

    /**
     * @return string The controller class to test
     */
    abstract protected function getControllerClass();

    protected function getTestSubject()
    {
        return $this->controller;
    }

    /**
     * @param $serviceName
     * @param $serviceContainerId
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockContainerService($serviceName, $serviceContainerId)
    {
        $service = $this
            ->getMockBuilder($serviceName)
            ->disableOriginalConstructor()
            ->getMock();

        $this->client->getContainer()->set($serviceContainerId, $service);
        return $service;
    }

    /**
     *
     */
    protected function isStatus200()
    {
        $this->isStatus(Response::HTTP_OK);
    }

    /**
     *
     */
    protected function isStatus500()
    {
        $this->isStatus(Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    /**
     * @param int $status
     */
    protected function isStatus($status = Response::HTTP_OK)
    {
        $this->assertEquals(
            $status,
            $this->client->getResponse()->getStatusCode()
        );
    }

    /**
     * @return Client
     */
    protected function createFakeClient()
    {
        $client = new Client();
        $client->modules->leads = new Module(true);
        $client->modules->newsletter = new Module(true);
        return $client;
    }

    /**
     * @return LocationSearch
     */
    protected function createFakeLocationSearch()
    {
        return new LocationSearch();
    }

    /**
     * @return Location
     */
    protected function createFakeLocation()
    {
        return new Location();
    }

    /**
     * @return Location
     */
    protected function createFakeLocationWithLocalisation()
    {
        $location = $this->createFakeLocation();
        $localisation = new Localisation();
        $localisation->city = 'city en';

        $coordinates = new Coordinates();
        $coordinates->latitude = 1.12345678;
        $coordinates->longitude = 2.3456789;
        $localisation->coordinates = $coordinates;

        $location->localisation = $localisation;

        return $location;
    }

    /**
     * @return Form
     */
    protected function createFakeForm()
    {
        $form = new Form();
        $form->_id = 'id';
        return $form;
    }

    /**
     * @return PublicationSearch
     */
    protected function createFakePublicationSearch()
    {
        return new PublicationSearch();
    }

    /**
     * @return Publication
     */
    protected function createFakePublication()
    {
        return new Publication();
    }

    /**
     * @return SearchSetting
     */
    protected function createFakeSearchSetting()
    {
        return new SearchSetting();
    }

    /**
     * @param  function $resolve
     * @return PromiseInterface
     */
    protected function createPromise($resolve)
    {
        $mockResponsePromise = new GuzzlePromise\Promise();
        $mockResponsePromise->resolve($resolve);
        return $mockResponsePromise;
    }

    /**
     */
    protected function isResponseJson()
    {
        $this->assertTrue(
            $this->client->getResponse()->headers->contains(
                'Content-Type',
                'application/json'
            ),
            'the "Content-Type" header is "application/json"'
        );
    }

    /**
     */
    protected function isResponseHtml()
    {
        $this->assertTrue(
            $this->client->getResponse()->headers->contains(
                'Content-Type',
                'text/html; charset=UTF-8'
            ),
            'the "Content-Type" header is "text/html; charset=UTF-8"'
        );
    }

    /**
     */
    protected function isResponseXml()
    {
        $this->assertTrue(
            $this->client->getResponse()->headers->contains(
                'Content-Type',
                'text/xml; charset=UTF-8'
            ),
            'the "Content-Type" header is "text/xml; charset=UTF-8"'
        );
    }

    protected function isResponseTxt()
    {
        $this->assertTrue(
            $this->client->getResponse()->headers->contains(
                'Content-Type',
                'text/plain; charset=UTF-8'
            ),
            'the "Content-Type" header is "text/plain; charset=UTF-8"'
        );
    }

    /**
     * @param mixed $responseContent
     */
    protected function isResponseContent($responseContent)
    {
        $this->assertEquals(
            $this->client->getResponse()->getContent(),
            $responseContent
        );
    }

    /**
     */
    protected function mockApiCalls()
    {
        $this->mockFormsResource();
        $this->mockFrontOfficesLocationsResource();
        $this->mockGeocodingResource();
        $this->mockLocationsResource();
        $this->mockPublicationsResource();
    }


    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockClientsResource()
    {
        if (!isset($this->clientsResource)) {
            $this->clientsResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\Clients\ClientsResource',
                'bridge_front_api.services.api.clients'
            );
            $this->clientsResource->method('callApi')->will($this->returnValue([]));
        }
        return $this->clientsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockFormsResource()
    {
        if (!isset($this->formsResource)) {
            $this->formsResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\Forms\FormsResource',
                'bridge_front_api.services.api.forms'
            );
            $this->formsResource->method('callApi')->will($this->returnValue([]));
        }
        return $this->formsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockFrontOfficesLocationsResource()
    {
        if (!isset($this->FrontOfficesLocationsResource)) {
            $this->FrontOfficesLocationsResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\FrontOffices\FrontOfficesLocationsResource',
                'bridge_front_api.services.api.front_offices'
            );
            $this->FrontOfficesLocationsResource->method('callApi')->will($this->returnValue([]));
        }
        return $this->FrontOfficesLocationsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockGeocodingResource()
    {
        if (!isset($this->geocodingResource)) {
            $this->geocodingResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\Geocoding\GeocodingResource',
                'bridge_front_api.services.api.geocoding'
            );
            $this->geocodingResource->method('callApi')->will($this->returnValue([]));
        }
        return $this->publicationsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockLocationsResource()
    {
        if (!isset($this->locationsResource)) {
            $this->locationsResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\Locations\LocationsResource',
                'bridge_front_api.services.api.locations'
            );
            $this->locationsResource->method('callApi')->will($this->returnValue([]));
        }
        return $this->locationsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockPublicationsResource()
    {
        if (!isset($this->publicationsResource)) {
            $this->publicationsResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\Publications\PublicationsResource',
                'bridge_front_api.services.api.publications'
            );
            $this->publicationsResource->method('callApi')->will($this->returnValue([]));
            $this->publicationsResource->method('constructPublicationsSearchFilter')->will($this->returnValue([]));
        }
        return $this->publicationsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockSettingsResource()
    {
        if (!isset($this->settingsResource)) {
            $this->settingsResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\SearchSettings\SearchSettingsResource',
                'bridge_front_api.services.api.search_settings'
            );
        }
        return $this->settingsResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockTopCitiesResource()
    {
        if (!isset($this->topCitiesResource)) {
            $this->topCitiesResource = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Api\TopCities\TopCitiesResource',
                'bridge_front_api.services.api.top_cities'
            );
        }
        return $this->topCitiesResource;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockSearchService()
    {
        if (!isset($this->searchService)) {
            $this->searchService = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Search\AlgoliaSearchService',
                'bridge_front_api.services.search'
            );
        }
        return $this->searchService;
    }

    /**
     * @return \PHPUnit_Framework_MockObject_MockObject
     */
    protected function mockGeodivisionSearchService()
    {
        if (!isset($this->geodivisionSearchService)) {
            $this->geodivisionSearchService = $this->mockContainerService(
                'Bridge\FrontApiBundle\Services\Search\AlgoliaGeodivisionSearchService',
                'bridge_front_api.services.geodivision_search'
            );
        }
        return $this->geodivisionSearchService;
    }
}
