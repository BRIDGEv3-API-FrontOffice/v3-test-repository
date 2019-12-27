<?php

namespace Bridge\FrontBundle\DependencyInjection;

use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\Config\FileLocator;
use Symfony\Component\Yaml\Yaml;

/**
 * Class BridgeFrontExtension
 * @package Bridge\FrontBundle\DependencyInjection
 */
class BridgeFrontExtension extends Extension implements PrependExtensionInterface
{
    /**
     * {@inheritDoc}
     * @SuppressWarnings(PHPMD.UnusedLocalVariable)
     */
    public function prepend(ContainerBuilder $container)
    {
        $themeFile = __DIR__ . '/../../Theme/' . $container->getParameter('bridge_front_starter_kit.front_theme') . 'Bundle/Resources/config/theme.yml';
        $yaml = new Yaml();
        $theme = file_exists($themeFile) ? $yaml->parse(file_get_contents($themeFile)) : [];

        $bundles = $container->getParameter('kernel.bundles');

        if (isset($bundles['BridgeFrontCoreBundle'])) {
            foreach ($container->getExtensions() as $name => $extension) {
                if ($name === 'bridge_front_core') {
                    $container->prependExtensionConfig($name, $theme);
                }
            }
        }

        $parameterBag = $container->getParameterBag();
        $assetBaseUrl = $parameterBag->resolveValue(
            $container->getParameter('bridge_front_starter_kit.cdn_base_url')
        );

        if (isset($assetBaseUrl) && false !== filter_var($assetBaseUrl, FILTER_VALIDATE_URL)) {
            $container->prependExtensionConfig(
                'framework',
                ['assets' => ['base_urls' => [$assetBaseUrl]]]
            );
        }
    }

    /**
     * {@inheritDoc}
     */
    public function load(array $configs, ContainerBuilder $container)
    {
    }

    /**
     * {@inheritDoc}
     */
    public function getAlias()
    {
        return 'bridge_front';
    }
}
