<?php

namespace Tests\Bridge\FrontBundle\Controller;

use Bridge\FrontApiBundle\Model\Location\City;
use Bridge\FrontApiBundle\Model\TopCities\TopCities;
use Bridge\FrontBundle\Controller\FrontController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class FrontControllerTest
 * @package Tests\Bridge\FrontBundle\Controller
 */
class FrontControllerTest extends AbstractControllerWebTestCase
{
    /**
     * @var \PHPUnit_Framework_MockObject_MockObject
     */
    protected $searchResource;

    /**
     * @inheritdoc
     */
    protected function getControllerClass()
    {
        return FrontController::class;
    }

    /**
     * @inheritdoc
     */
    protected function setUp()
    {
        parent::setUp();
    }

    private function mockGetPublicationByZoneAsync($action) {
        $publicationsResource = $this->mockPublicationsResource();
        $theme = $this->client->getContainer()->getParameter('bridge_front_core.theme');
        $responseMock = [];
        if (isset($theme['actions'][$action]['zones'])) {
            $zones = $theme['actions'][$action]['zones'];

            foreach ($zones as $zone => $conf) {
                $responseMock[$zone] = $this->createPromise($this->createFakePublicationSearch());
            }
        }

        $this->mockPublicationsResource()
            ->expects($this->exactly(1))
            ->method('getPublicationsByZonesAsync')
            ->willReturn($responseMock);
    }

    /**
     *
     */
    public function testHomeAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $topCitiesResource = $this->mockTopCitiesResource();
        $topCitiesResource
            ->expects($this->once())
            ->method('getTopCitiesAsync')
            ->willReturn($this->createPromise(new TopCities()));

        $this->mockGetPublicationByZoneAsync('Bridge\FrontBundle\Controller\FrontController::homeAction');

        $searchSettingService = $this->mockSettingsResource();
        $searchSettingService
            ->expects($this->once())
            ->method('getSearchSettingAsync')
            ->willReturn($this->createPromise($this->createFakeSearchSetting()));

        $this->client->request('GET', '/');

        $this->isStatus200();
        $this->isResponseHtml();
    }

    /**
     *
     */
    public function testSearchAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $searchService = $this->mockSearchService();
        $searchService
            ->expects($this->once())
            ->method('searchLocations')
            ->willReturn($this->createFakeLocationSearch());

        $this->mockGetPublicationByZoneAsync('Bridge\FrontBundle\Controller\FrontController::searchAction');

        $searchSettingService = $this->mockSettingsResource();
        $searchSettingService
            ->expects($this->once())
            ->method('getSearchSettingAsync')
            ->willReturn($this->createPromise($this->createFakeSearchSetting()));

        $this->client->request('GET', '/search');

        $this->isStatus200();
        $this->isResponseHtml();
    }

    /**
     *
     */
    // public function testGdprAction()
    // {
    //   $clientsResource = $this->mockClientsResource();
    //   $clientsResource
    //       ->expects($this->atLeastOnce())
    //       ->method('getClient')
    //       ->willReturn($this->createFakeClient());

    //   $this->client->request('GET', '/gdpr/legal');
    //   $this->isStatus200();
    //   $this->isResponseHtml();

    //   $this->client->request('GET', '/gdpr/protection');
    //   $this->isStatus200();
    //   $this->isResponseHtml();

    //   $this->client->request('GET', '/gdpr/cookies');
    //   $this->isStatus200();
    //   $this->isResponseHtml();

    //   $this->client->request('GET', '/gdpr/lorem');
    //   $this->isStatus(Response::HTTP_NOT_FOUND);
    //   $this->isResponseHtml();
    // }

    /**
     *
     */
    public function testLocationAction()
    {
        $mockedClient = $this->createFakeClient();
        $this->mocksResourceBaseForLocationAction($mockedClient);
        $this->mocksResource($mockedClient);
        $this->isStatus200();
        $this->isResponseHtml();
    }

    /**
     *
     */
    public function testLocationActionWithoutLeads()
    {
        $mockedClient = $this->createFakeClient();
        $mockedClient->modules->leads->setActivated(false);
        $this->mocksResourceBaseForLocationAction($mockedClient);
        $this->mocksResource($mockedClient);
        $this->isStatus200();
        $this->isResponseHtml();
    }

    /**
     *
     */
    public function testLocationActionWithoutNewsletter()
    {
        $mockedClient = $this->createFakeClient();
        $mockedClient->modules->newsletter->setActivated(false);
        $this->mocksResourceBaseForLocationAction($mockedClient);
        $this->mocksResource($mockedClient);
        $this->isStatus200();
        $this->isResponseHtml();
    }

    /**
     * Regroups the base resources for locationAction() testing
     * @param Client mockedClient
     */
    public function mocksResourceBaseForLocationAction($mockedClient)
    {
        $location = $this->createFakeLocation();
        $location->hasStoreLocatorPage = true;
        $location->seoId = '123456789';
        $location->slug = 'a-slipery-slug';

        $locationsResource = $this->mockLocationsResource();
        $locationsResource
            ->expects($this->once())
            ->method('getLocationBySeoIdAsync')
            ->with('123456789')
            ->willReturn($this->createPromise($location));


        $this->mockGetPublicationByZoneAsync('Bridge\FrontBundle\Controller\FrontController::locationAction');

        $searchSettingService = $this->mockSettingsResource();
        $searchSettingService
            ->expects($this->once())
            ->method('getSearchSettingAsync')
            ->willReturn($this->createPromise($this->createFakeSearchSetting()));

        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($mockedClient);

        $searchService = $this->mockSearchService();
        $searchService
            ->method('searchGeoloc')
            ->willReturn($this->createFakeLocationSearch());
    }

    public function testLocationActionWithoutStoreLocatorPage()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $location = $this->createFakeLocation();
        $location->hasStoreLocatorPage = false;
        $location->seoId = '123456789';
        $location->slug = 'a-slipery-slug';

        $locationsResource = $this->mockLocationsResource();
        $locationsResource
            ->expects($this->once())
            ->method('getLocationBySeoIdAsync')
            ->with('123456789')
            ->willReturn($this->createPromise($location));

        $this->client->request('GET', '/123456789-a-slipery-slug');
        $this->isStatus(404);
    }


    public function testLocationActionWithLocalisation()
    {
        $locationWithLocalisation = $this->createFakeLocationWithLocalisation();
        $locationWithLocalisation->hasStoreLocatorPage = true;
        $locationWithLocalisation->seoId = '123456789';
        $locationWithLocalisation->slug = 'a-slipery-slug';
        $locationWithLocalisation->localisation->city = new City();
        $locationWithLocalisation->localisation->city->name = 'city en';
        $locationWithLocalisation->active = false;

        $locationsResource = $this->mockLocationsResource();
        $locationsResource
            ->expects($this->once())
            ->method('getLocationBySeoIdAsync')
            ->with('123456789')
            ->willReturn($this->createPromise($locationWithLocalisation));

        $searchService = $this->mockSearchService();
        $searchService
            ->expects($this->any())
            ->method('searchGeoloc')
            ->willReturn($this->createFakeLocationSearch());

        $searchSettingService = $this->mockSettingsResource();
        $searchSettingService
            ->expects($this->once())
            ->method('getSearchSettingAsync')
            ->willReturn($this->createPromise($this->createFakeSearchSetting()));

        $publicationsResource = $this->mockPublicationsResource();
        $publicationsResource
            ->expects($this->exactly(1))
            ->method('getPublicationsByZonesAsync')
            ->willReturn([
                'banners-mobile' => $this->createPromise($this->createFakePublicationSearch()),
                'banners-desktop' => $this->createPromise($this->createFakePublicationSearch()),
                'events' => $this->createPromise($this->createFakePublicationSearch()),
                'news' => $this->createPromise($this->createFakePublicationSearch())
            ]);

        $mockedClient = $this->createFakeClient();
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($mockedClient);

        $this->mocksResource($mockedClient);
        $this->isStatus200();
        $this->isResponseHtml();
    }

    /**
     *
     */
    public function testLocationActionWith301()
    {
        $searchService = $this->mockSearchService();
        $location = $this->createFakeLocation();
        $location->hasStoreLocatorPage = true;
        $location->seoId = '1';
        $location->slug = 'a-slipery-slug';

        $locationsResource = $this->mockLocationsResource();
        $locationsResource->expects($this->once())
            ->method('getLocationBySeoIdAsync')
            ->with('1')
            ->willReturn($this->createPromise($location));

        $searchService
            ->method('searchGeoloc')
            ->willReturn($this->createFakeLocationSearch());

        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $this->client->request('GET', '/1');

        $this->isStatus(Response::HTTP_MOVED_PERMANENTLY);
        $this->isResponseHtml();
    }

    /**
     * @param Client mockedClient
     */
    public function mocksResource($mockedClient)
    {
        $leadsActivated = $mockedClient->modules->leads->getActivated();

        $formResource = $this->mockFormsResource();
        $formResource
            ->expects($leadsActivated ? $this->once() : $this->never())
            ->method('getFormBySlugAsync')
            ->with('default-contact-form')
            ->willReturn($this->createPromise($this->createFakeForm()));

        $publicationsResource = $this->mockPublicationsResource();
        $publicationsResource
            ->expects($this->exactly(1))
            ->method('getPublicationsByZonesAsync')
            ->willReturn([
                'banners-mobile' => $this->createPromise($this->createFakePublicationSearch()),
                'banners-desktop' => $this->createPromise($this->createFakePublicationSearch()),
                'events' => $this->createPromise($this->createFakePublicationSearch()),
                'news' => $this->createPromise($this->createFakePublicationSearch())
            ]);

        $searchSettingService = $this->mockSettingsResource();
        $searchSettingService
            ->expects($this->once())
            ->method('getSearchSettingAsync')
            ->willReturn($this->createPromise($this->createFakeSearchSetting()));

        $this->client->request('GET', '/123456789-a-slipery-slug');
    }

    public function testInfowindowAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $location = $this->createFakeLocation();
        $location->hasStoreLocatorPage = true;
        $location->seoId = '123456789';

        $locationsResource = $this->mockLocationsResource();
        $locationsResource
            ->expects($this->once())
            ->method('getLocationBySeoIdAsync')
            ->with('123456789')
            ->willReturn($this->createPromise($location));

        $this->client->request('POST', '/infowindow', [], [], [], json_encode($location));

        $this->isStatus200();
        $this->isResponseHtml();
    }
}
