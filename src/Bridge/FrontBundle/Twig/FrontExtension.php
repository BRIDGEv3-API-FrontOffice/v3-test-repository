<?php

namespace Bridge\FrontBundle\Twig;

use Symfony\Component\Translation\TranslatorInterface;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;

class FrontExtension extends AbstractExtension
{
    /**
     * @var string
     */
    private $env;

    public function __construct(string $env)
    {
        $this->env = $env;
    }

    public function getFilters()
    {
        return [
            new TwigFilter('https', [$this, 'getHttps']),
            new TwigFilter('ksort', [$this, 'sortByKeys']),
            new TwigFilter('sortBy', [$this, 'sortBy']),
        ];
    }

    /**
     * Return https url
     *
     * @param string $string
     * @return string
     */
    public function getHttps($string)
    {
        if ($this->env === 'dev' || $this->env === 'test') {
            return $string;
        }

        return str_replace('http://', 'https://', $string);
    }

    /**
     * Sort an array by keys
     *
     * @param array $array
     * @param int $sortFlag
     * @return array
     */
    public function sortByKeys($array, $sortFlag = SORT_REGULAR)
    {
        ksort($array, $sortFlag);

        return $array;
    }

    /**
     * Sort an array of objects by a property
     *
     * @param array $array
     * @param string $property
     * @return array
     */
    public function sortBy($array, $property)
    {
        usort($array, function ($valueA, $valueB) use ($property) {
            $valueAl = strtolower($valueA->$property);
            $valueBl = strtolower($valueB->$property);

            if ($valueAl == $valueBl) {
                return 0;
            }

            return ($valueAl > $valueBl) ? +1 : -1;
        });

        return $array;
    }
}
