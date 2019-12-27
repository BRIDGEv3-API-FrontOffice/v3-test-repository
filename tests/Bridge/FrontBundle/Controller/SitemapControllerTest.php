<?php

namespace Tests\Bridge\FrontBundle\Controller;

use Bridge\FrontBundle\Controller\SitemapController;

/**
 * Class FrontControllerTest
 * @package Tests\Bridge\FrontBundle\Controller
 */
class SitemapControllerTest extends AbstractControllerWebTestCase
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
        return SitemapController::class;
    }

    public function testSitemapAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $geodivisionSearchService = $this->mockGeodivisionSearchService();
        $geodivisionSearchService->expects($this->once())
            ->method('getLocationsCount')
            ->willReturn(10);

        $this->client->request('GET', '/sitemap.xml');
        $this->isStatus200();
        $this->isResponseXml();
    }

    public function testMainSitemapAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $searchService = $this->mockSearchService();
        $searchService->expects($this->once())
            ->method('getTopcities')
            ->willReturn(['Paris', 'Berlin']);

        $this->client->request('GET', '/mainsitemap.xml');
        $this->isStatus200();
        $this->isResponseXml();
    }

    public function testLocationsSitemapAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $location = $this->createFakeLocation();
        $location->hasStoreLocatorPage = true;
        $location->seoId = '42';
        $location->slug = 'foo';

        $locationSearch = $this->createFakeLocationSearch();
        $locationSearch->setRows([$location]);

        $locationsResource = $this->mockLocationsResource();
        $locationsResource->expects($this->once())
            ->method('searchLocations')
            ->with(
                ['hasStoreLocatorPage' => true],
                10000,
                [],
                1,
                [
                    'hasStoreLocatorPage' => 1,
                    'website' => 1,
                    'updatedAt' => 1,
                    'slug' => 1,
                    'seoId' => 1,
                ]
            )
            ->will($this->returnValue($locationSearch));

        $this->client->request('GET', '/locationsitemap1.xml');
        $response = $this->client->getResponse();

        $this->isStatus200();
        $this->isResponseXml();
    }

    public function testLocationsSitemapActionWithNoResults()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $locationSearch = $this->createFakeLocationSearch();
        $locationSearch->setRows([]);

        $locationsResource = $this->mockLocationsResource();
        $locationsResource->expects($this->once())
            ->method('searchLocations')
            ->with(['hasStoreLocatorPage' => true], 10000, [], 1)
            ->will($this->returnValue($locationSearch));

        $this->client->request('GET', '/locationsitemap1.xml');
        $response = $this->client->getResponse();

        $this->isStatus(404);
        $this->isResponseXml();
    }
}
