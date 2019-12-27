<?php
// src/Bridge/FrontBundle/DataObject/Redirection.php
namespace Bridge\FrontBundle\DataObject;

class Redirection
{

    private const FRAMEWORK_BUNDLE_REDIRECT_URL_REDIRECT = "FrameworkBundle:Redirect:urlRedirect";

    /**
     * @var string
     */
    private $fromUrl;
    /**
     * @var string
     */
    private $redirectUrl;
    /**
     * @var bool
     */
    private $permanent;


    public function __construct(string $fromUrl, string $redirectUrl, $permanent)
    {
        $this->fromUrl = self::format($fromUrl);
        $this->redirectUrl = self::format($redirectUrl);

        
        if (is_string($permanent)) {
            $this->permanent = $permanent === "302" ? false : true;
        }
        if (is_bool($permanent)) {
            $this->permanent = $permanent;
        }
        if (!isset($this->permanent)) {
            $this->permanent = true;
        }
    }

    public function getYamlArrayOutput()
    {
        return [
            'path' => $this->getFromUrl(),
            'defaults' => [
                '_controller' => self::FRAMEWORK_BUNDLE_REDIRECT_URL_REDIRECT,
                'path' => $this->redirectUrl,
                'permanent' => $this->permanent
            ]
        ];
    }

    private static function format($url)
    {
        //Remove protocol and domain
        $url = preg_replace('/(https?:\/\/)([^:^\/]*)/', '', $url);
        return $url;
    }

    public function getFromUrl()
    {
        return $this->fromUrl;
    }

    public function getRedirectUrl()
    {
        return $this->redirectUrl;
    }

    public function isPermanent()
    {
        return $this->permanent;
    }
}
