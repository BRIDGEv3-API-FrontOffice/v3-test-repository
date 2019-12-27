<?php

namespace Bridge\FrontBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;

/**
 * Class RobotsController
 * @package Bridge\FrontBundle\Controller
 * @Route("/")
 */
class RobotsController extends Controller
{

    /**
     * Matches leadformance hostname
     * @var Regex
     */
    private const INTERNAL_HOST_REGEX = '/leadformance.com$/';

    /**
     * Default robots.txt twig template
     * @var String
     */
    public const DEFAULT_ROBOTS_TEMPLATE = 'BridgeFrontBundle::robots/robots.txt.twig';

    /**
     * Deny robots.txt twig template
     * @var String
     */
    public const DENY_ROBOTS_TEMPLATE = 'BridgeFrontBundle::robots/deny.robots.txt.twig';

    /**
     * @Route(
     *   "/robots.{_format}",
     *   name="root_robots",
     *   Requirements={"_format" = "txt"}
     * )
     * @Cache(smaxage=300)
     */
    public function robotsAction(Request $request)
    {
        return $this->render(
            $this->getTemplateFromHostname($request->getHost())
        );
    }

    /**
    * @param string     Hostname
    * @return string    String referring to a template
    */
    public function getTemplateFromHostname($hostName)
    {
        if (preg_match(RobotsController::INTERNAL_HOST_REGEX, $hostName)) {
            return RobotsController::DENY_ROBOTS_TEMPLATE;
        }

        return RobotsController::DEFAULT_ROBOTS_TEMPLATE;
    }
}
