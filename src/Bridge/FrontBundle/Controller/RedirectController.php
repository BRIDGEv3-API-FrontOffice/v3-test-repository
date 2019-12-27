<?php

namespace Bridge\FrontBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Cache;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

/**
 * Class RedirectController
 * *
 * @package Bridge\FrontBundle\Controller
 */
class RedirectController extends Controller
{
    /**
     * @Route("/{url}", name="remove_trailing_slash",
     *     requirements={"url" = ".*\/$"}, methods={"GET"})
     * @Cache(smaxage=300)
     */
    public function removeTrailingSlashAction(Request $request)
    {
        $pathInfo = $request->getPathInfo();
        $requestUri = $request->getRequestUri();

        $url = str_replace($pathInfo, rtrim($pathInfo, '/'), $requestUri);

        return $this->redirect($url, 301);
    }
}
