<?php

namespace Bridge\FrontBundle\Logger;

use Symfony\Component\HttpFoundation\RequestStack;

class RequestIdProcessor
{
    private const REQUEST_ID_HEADER = 'X-Request-Id';

    protected $requestStack;

    public function __construct(RequestStack $requestStack)
    {
        $this->requestStack = $requestStack;
    }

    public function __invoke(array $record)
    {
        $request = $this->requestStack->getCurrentRequest();

        $record['extra']['request_id'] = '-';

        if ($request !== null && $request->headers->has(self::REQUEST_ID_HEADER)) {
            $record['extra']['request_id'] = $request->headers->get(self::REQUEST_ID_HEADER);
        }

        return $record;
    }
}
