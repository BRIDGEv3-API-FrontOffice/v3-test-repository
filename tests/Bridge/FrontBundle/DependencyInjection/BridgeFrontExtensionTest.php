<?php
namespace Tests\Bridge\FrontBundle\DependencyInjection;

use Bridge\FrontBundle\DependencyInjection\BridgeFrontExtension;
use Symfony\Component\DependencyInjection\ContainerBuilder;

class BridgeFrontExtensionTest extends \PHPUnit_Framework_TestCase
{
	public function testPrepend()
	{
		$baseUrl = 'http://foo.com/v42';
		$domains = [
			'fr.domain' => [
				'activated' => true,
				'locale' => 'fr'
			],
			'en.domain' => [
				'activated' => true,
				'locale' => 'en'
			],
			'en.bis.domain' => [
				'activated' => true,
				'locale' => 'en'
			],
			'es.domain' => [
				'activated' => false,
				'locale' => 'es'
			]
		];

		$container = new ContainerBuilder();

		$container->setParameter('kernel.bundles', []);
		$container->setParameter('bridge.cdn_base_url', $baseUrl);
		$container->setParameter('bridge_front_starter_kit.cdn_base_url', '%bridge.cdn_base_url%');
		$container->setParameter('bridge_front_core.store_locator.domains', $domains);
		$container->setParameter('bridge_front_starter_kit.front_theme', 'Essential');

	    $extension = new BridgeFrontExtension();

	    $extension->prepend($container);

	    $this->assertEquals(
		[['assets' => ['base_urls' => [$baseUrl]]]],
	    	$container->getExtensionConfig('framework')
	    );
	}
}
