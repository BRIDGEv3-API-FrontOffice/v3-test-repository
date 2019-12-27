<?php

namespace Bridge\FrontBundle\Controller;

use Bridge\FrontCoreBundle\Controller\AbstractController;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class LocationSearchController
 * @package Bridge\FrontCoreBundle\Controller
 * @Route("/search")
 */
class LocationSearchController extends AbstractController
{
    /**
     * @param Request $request The request
     * @Method("POST")
     * @Route(
     *     "/coordinates.{_format}",
     *     defaults={"_format": "json"},
     *     requirements={
     *         "_format": "html|json",
     *     },
     *     name="location_search_coordinates"
     * )
     *
     * @return Response A Response instance
     */
    public function searchByCoordinatesAction(Request $request)
    {
        $searchService = $this->get('bridge_front_api.services.search');

        $body = array_merge([
            'latitude' => null,
            'longitude' => null,
            'options' => []
        ], $this->getJsonBody($request));

        $results = $searchService->searchGeoloc($body['latitude'], $body['longitude'], $body['options']);

        return $this->renderSearch($request, $results);
    }

    /**
     * @param Request $request The request
     * @Method("POST")
     * @Route(
     *     "/text.{_format}",
     *     defaults={"_format": "json"},
     *     requirements={
     *         "_format": "html|json",
     *     },
     *     name="location_search_text"
     * )
     *
     * @return Response A Response instance
     */
    public function searchByTextAction(Request $request)
    {
        $searchService = $this->get('bridge_front_api.services.search');

        $body = array_merge([
            'query' => null,
            'options' => []
        ], $this->getJsonBody($request));

        $results = $searchService->searchText($body['query'], $body['options']);

        return $this->renderSearch($request, $results);
    }

    /**
     * @param Request $request The request
     * @Method("POST")
     * @Route(
     *     "/custom.{_format}",
     *     defaults={"_format": "json"},
     *     requirements={
     *         "_format": "html|json",
     *     },
     *     name="location_search_custom"
     * )
     *
     * @return Response A Response instance
     */
    public function searchByCustomAction(Request $request)
    {
        $searchService = $this->get('bridge_front_api.services.search');

        $body = array_merge([
            'query' => null,
            'options' => []
        ], $this->getJsonBody($request));


        $results = $searchService->searchLocations($body['query'], $body['options']);

        return $this->renderSearch($request, $results);
    }

    protected function renderSearch(Request $request, $results)
    {
        $format = $request->getRequestFormat();

        if ('json' === $format) {
            $results = $this
                ->get('serializer')
                ->normalize($results);
        }

        $locations = [];
        foreach ($results->getRows() as $location) {
            $locations[] = $this->render($this->getTemplateName($request), [
                'location' => $location
            ]);
        }

        return new Response(implode($locations));
    }

    protected function getTemplateName(Request $request)
    {
        $format = $request->getRequestFormat();

        return "@components/thumbnail/default/template.$format.twig";
    }
}
