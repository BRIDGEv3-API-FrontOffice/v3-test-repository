<?php

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Debug\Debug;

// If you don't want to setup permissions the proper way, just uncomment the following PHP line
// read http://symfony.com/doc/current/book/installation.html#checking-symfony-application-configuration-and-setup
// for more information
//umask(0000);

function cidr_check( $cidr, $chkip=null )
{
    // Assign IP / mask
    list($ip,$mask) = explode("/",$cidr);

    // Sanitize IP
    $ip1 = preg_replace( '_(\d+\.\d+\.\d+\.\d+).*$_', '$1', "$ip.0.0.0" );

    // Calculate range
    $ip2 = long2ip( ip2long( $ip1 ) - 1 + ( 1 << ( 32 - $mask) ) );

    // are we cidr range cheking?
    if ( $chkip != null && ! filter_var( $chkip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) === false )
    {
        return ip2long( $ip1 ) <= ip2long( $chkip ) && ip2long( $ip2 ) >= ip2long( $chkip ) ? true : false;
    }
    return "$ip1 - $ip2";
}

// This check prevents access to debug front controllers that are deployed by accident to production servers.
// Feel free to remove this, extend it, or make something more sophisticated.
if(!cidr_check('10.0.0.0/8', @$_SERVER['REMOTE_ADDR'])) {
    if (isset($_SERVER['HTTP_CLIENT_IP'])
        || isset($_SERVER['HTTP_X_FORWARDED_FOR']) && !in_array(@$_SERVER['HTTP_X_FORWARDED_FOR'], ['37.71.78.18'])
        || !(in_array(@$_SERVER['REMOTE_ADDR'], ['127.0.0.1', '::1', '::ffff:172.19.0.1', '172.19.0.1', '37.71.78.18']) || php_sapi_name() === 'cli-server' || in_array(@$_SERVER['HTTP_X_FORWARDED_FOR'], ['37.71.78.18']))
    ) {
        header('HTTP/1.0 403 Forbidden');
        exit('You are not allowed to access this file. Check ' . basename(__FILE__) . ' for more information.');
    }
}

/**
 * @var Composer\Autoload\ClassLoader $loader
 */
$loader = require __DIR__ . '/../app/autoload.php';
Debug::enable();

$kernel = new AppKernel('dev', true);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
