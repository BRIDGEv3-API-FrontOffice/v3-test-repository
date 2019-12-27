<?php

namespace Tests\Bridge\FrontBundle\Logger;

use Bridge\FrontBundle\Logger\RequestIdProcessor;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

class RequestIdProcessorTest extends \PHPUnit_Framework_TestCase
{
    private const REQUEST_ID = 'test-request-id';

    private function getRecordMock()
    {
        return ['extra' => []];
    }

    public function testValidateRequestIdProcessorWhenRequestIdHeaderIsPresent()
    {
        $request = new Request([], [], [], [], [], ["HTTP_X_REQUEST_ID" => self::REQUEST_ID]);

        $requestStack = new RequestStack();
        $requestStack->push($request);

        $requestIdProcessor = new RequestIdProcessor($requestStack);

        $record = $requestIdProcessor($this->getRecordMock());

        $this->assertArrayHasKey('request_id', $record['extra']);
        $this->assertTrue($record['extra']['request_id'] === self::REQUEST_ID);
    }

    public function testValidateRequestIdProcessorWhenRequestIdHeaderIsMissing()
    {
        $request = new Request();

        $requestStack = new RequestStack();
        $requestStack->push($request);

        $requestIdProcessor = new RequestIdProcessor($requestStack);

        $record = $requestIdProcessor($this->getRecordMock());

        $this->assertArrayHasKey('request_id', $record['extra']);
        $this->assertTrue($record['extra']['request_id'] === '-');
    }
}
