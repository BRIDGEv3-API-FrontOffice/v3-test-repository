<?php

namespace Tests\Bridge\FrontBundle\DataObject;

use Bridge\FrontBundle\DataObject\Redirection;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Output\ConsoleOutput;
use Tests\Bridge\FrontBundle\AccessibleTrait;

class RedirectionTest extends KernelTestCase
{
    use AccessibleTrait;

    protected function setUp()
    {
        $this->redirection = new Redirection('','','');
    }

    public function testIsPermanent()
    {
        $redirect = new Redirection('/from1', '/to1', 'blop');        
        $res = $redirect->isPermanent();
        $this->assertTrue($res);

        $redirect = new Redirection('/from1', '/to1', '302');
        $res = $redirect->isPermanent();
        $this->assertFalse($res);

        $redirect = new Redirection('/from1', '/to1', '301');
        $res = $redirect->isPermanent();
        $this->assertTrue($res);
    }

    public function testGetFromUrl()
    {
        $redirect = new Redirection('/from1', '/to1', '301');
        $fromUrl = $redirect->getFromUrl();
        $this->assertEquals('/from1', $fromUrl);

        $redirect = new Redirection('http://sub.domain.com/from1', '/to1', '301');
        $fromUrl = $redirect->getFromUrl();
        $this->assertEquals('/from1', $fromUrl);

        $redirect = new Redirection('https://sub.domain.com/from1', '/to1', '301');
        $fromUrl = $redirect->getFromUrl();
        $this->assertEquals('/from1', $fromUrl);
    }

    public function testGetRedirectUrl()
    {
        $redirect = new Redirection('/from1', '/to1', '301');
        $redUrl = $redirect->getRedirectUrl();
        $this->assertEquals('/to1', $redUrl);

        $redirect = new Redirection('/from1', 'http://sub.domain.com/to1', '301');
        $redUrl = $redirect->getRedirectUrl();
        $this->assertEquals('/to1', $redUrl);

        $redirect = new Redirection('/from1', 'https://sub.domain.com/to1', '301');
        $redUrl = $redirect->getRedirectUrl();
        $this->assertEquals('/to1', $redUrl);
    }

    public function getTestSubject()
    {
        return $this->redirection;
    }
}