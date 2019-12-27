<?php

namespace Tests\Bridge\FrontBundle\Controller;

use Bridge\FrontBundle\Controller\RobotsController;

/**
 * Class FrontControllerTest
 * @package Tests\Bridge\FrontBundle\Controller
 */
class RobotsControllerTest extends AbstractControllerWebTestCase
{
    /**
     * @inheritdoc
     */
    protected function getControllerClass()
    {
        return RobotsController::class;
    }

    public function testRobotsAction()
    {
        $clientsResource = $this->mockClientsResource();
        $clientsResource
            ->expects($this->atLeastOnce())
            ->method('getClient')
            ->willReturn($this->createFakeClient());

        $this->client->request('GET', '/robots.txt');
        $this->isStatus200();
        $this->isResponseTxt();
    }

    public function testTemplateFromLeadformanceHostname() {
        $controller = new RobotsController();

        $this->assertEquals(
            $controller->getTemplateFromHostname('client-fr.v3.leadformance.com'),
            RobotsController::DENY_ROBOTS_TEMPLATE
        );

        $this->assertEquals(
            $controller->getTemplateFromHostname('magasins-client.myclient.com'),
            RobotsController::DEFAULT_ROBOTS_TEMPLATE
        );
    }
}
