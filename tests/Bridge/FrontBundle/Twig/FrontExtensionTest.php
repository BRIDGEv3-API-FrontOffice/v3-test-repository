<?php

namespace Tests\Bridge\FrontBundle\Twig;

use Bridge\FrontBundle\Twig\FrontExtension;
use PHPUnit\Framework\TestCase;
use Twig\TwigFilter;

/**
 * Class FrontExtensionTest
 * @package Tests\Bridge\FrontBundle\Twig
 */
class FrontExtensionTest extends TestCase
{
    /**
     * @var FrontExtension
     */
    protected $frontExtension;

    private $env = 'prod';

    protected function setUp()
    {
      $this->frontExtension = new FrontExtension($this->env);
    }

    public function testGetFilters()
    {
        $filter = $this->frontExtension->getFilters();
        $this->assertEquals($filter, [
          new TwigFilter('https', [$this->frontExtension, 'getHttps']),
          new TwigFilter('ksort', [$this->frontExtension, 'sortByKeys']),
          new TwigFilter('sortBy', [$this->frontExtension, 'sortBy']),
      ]);
    }

    public function testGetHttps()
    {
      $url = $this->frontExtension->getHttps('http://example.com');
      $this->assertEquals($url, 'https://example.com');
    }

    public function testSortByKeys()
    {
        $array = ["d" => "lemon", "a" => "orange", "b" => "banana", "c" => "apple"];
        $sorted = $this->frontExtension->sortByKeys($array);
        $this->assertEquals($sorted, ["a" => "orange", "b" => "banana", "c" => "apple", "d" => "lemon"]);
    }

    public function testSortBy()
    {
        $obj1 = new Someclass('lemon');
        $obj2 = new Someclass('grappe');
        $obj3 = new Someclass('apple');

        $array = [$obj1, $obj2, $obj3];
        $sorted = $this->frontExtension->sortBy($array, 'name');
        $this->assertEquals($sorted, [$obj3, $obj2, $obj1]);
    }
}

class SomeClass
{
    public $name;

    public function __construct($name)
    {
        $this->name = $name;
    }
}
