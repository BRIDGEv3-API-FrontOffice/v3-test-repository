<?php

use \Symfony\Component\DependencyInjection\ContainerBuilder;

/**
 * Class DynamicDevParameter
 */
class DynamicDevParameter
{
    /**
     *
     */
    const DEV_MEREVO_CLIENT_ID = '57f76cf6a4da070f00c58e73';

    /**
     *
     */
    const DEV_MEREVO_FRONT_OFFICE_ID = '57fca525a3fea20f005f6b46';

    /**
     *
     */
    const DEV_MEREVO_BEARER = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjIzNDU2NzM0NTY3ODQsImlzcyI6Imh0dHBzOi8vc3NvLmRldi52My5hd3MubGVhZC5mbS9hdXRoL3JlYWxtcy9icmlkZ2UtdGVzdCIsImF1ZCI6ImJyaWRnZS1mcm9udC1zdGFydGVyLWtpdCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImJyaWRnZS1mcm9udC1zdGFydGVyLWtpdCIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwOi8vMTI3LjAuMC4xIiwiKi5hd3MubGVhZGZvcm1hbmNlLmNvbSIsImh0dHBzOi8vbG9jYWxob3N0IiwiaHR0cDovL2xvY2FsaG9zdCJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZnJvbnRfb2ZmaWNlIl19LCJjbGllbnRzIjpbIjU3Zjc2Y2Y2YTRkYTA3MGYwMGM1OGU3MyJdLCJyb2xlX2xldmVsIjoiZnJvbnRfb2ZmaWNlIiwicm9sZV90eXBlIjoicGxhdGZvcm0iLCJuYW1lIjoiU3RhcnRlciBLaXQgRnJvbnQgb2ZmaWNlIiwicHJlZmVycmVkX3VzZXJuYW1lIjoic3RhcnRlci1raXRAbGVhZGZvcm1hbmNlLmNvbSIsImdpdmVuX25hbWUiOiJLaXQiLCJmYW1pbHlfbmFtZSI6IlN0YXJ0ZXIiLCJlbWFpbCI6InN0YXJ0ZXIta2l0QGxlYWRmb3JtYW5jZS5jb20iLCJpYXQiOjE1MzUwMTA4MDF9.gg2g4PS3v1YFncUdNOSTn7rF-lHYqfyIt7N4X9vr3FN7digYtrmHROItujvWAGb9srxpUy67Y_F6o61QzIJLzU5iQkI2BCTyTUKGY6ZGcuA-cfqnpc6-pFDBDZoft_1ggL9KbvhyANBbW2-lruRLGWAYZlmT2dKfVM1XW6A9Gh3ecqbL6RI-agpMYhPV2E1jLDEhBeZThTqAtaO-KtUj7Ya5nVnQ8dx5U_3QpbwxxfBJ3SHQkFAArZeROOS4qkX3aA7A4scCPkrS47TpkoRLDPSuyi40xafwpoWReE_dODcg8-e5_tlv-6F92fclZBrRfV2UFwc_CBxxupKp3uW3DQ';

    /**
     *
     */
    const DEV_MEREVO_ALGOLIA_APP_ID = '08BJKW94ZW';

    /**
     *
     */
    const DEV_MEREVO_ALGOLIA_API_KEY = '067661f552e8571c8646f46a1b4e2d72';

    /**
     * @var ContainerBuilder $container
     */
    protected $container;

    /**
     * @var string $environment
     */
    protected $environment;

    /**
     * @var string $localStack
     */
    protected $localStack;

    /**
     * DynamicDevParameter constructor.
     *
     * @param ContainerBuilder $container
     */
    public function __construct(ContainerBuilder $container)
    {
        $this->container = $container;
        $this->environment = $this->container->getParameter("kernel.environment");
        $this->localStack = $this->container->getParameter("bridge_front_starter_kit.local_development_stack");

        $this->setDefaultConfigurations();
    }

    /**
     */
    protected function setDefaultConfigurations()
    {
        switch ($this->environment) {
            case 'dev':
                // Set the development configurations
                $this->setDevCustomConfigurations();
                break;
            case 'test':
                // Set the development configurations
                $this->setTestCustomConfigurations();
                break;
            default:
                break;
        }
        // Set default values for development purpose
        $this->setEnvVariable("bridge_front_starter_kit.forms.contact.recaptcha.active", '');
        $this->setEnvVariable("bridge_front_starter_kit.forms.contact.recaptcha.site_key", '');
        $this->setEnvVariable("bridge_front_starter_kit.forms.contact.recaptcha.private_key", '');
        $this->setEnvVariable("bridge_front_starter_kit.deployment_namespace", 'local');
    }

    /**
     * Set all the dev configurations
     */
    protected function setDevCustomConfigurations()
    {
        if (!$this->localStack) {
            // If it's not set, use the production stack
            $this->setEnvVariablesForProduction();
            return;
        }

        switch ($this->localStack) {
            case 'production':
                $this->setEnvVariablesForProduction();
                break;
            default:
                // Use the dev stack
                $this->setEnvVariablesForDevStack();
                break;
        }
    }

    /**
     * Set all the test configurations
     */
    protected function setTestCustomConfigurations()
    {
        $this->setDeploymentEnvironment("test");
        $this->setUrlEnvVariables("test");
        $this->removeCdnUrl();
        $this->removeInternalDomainPattern();
        // Set the merevo default config
        $this->setMerevoClientEnvVariables();
    }

    /**
     * Set all the variables in order to work in a dev stack
     */
    protected function setEnvVariablesForDevStack()
    {
        $this->setDeploymentEnvironment($this->localStack);
        $this->setUrlEnvVariables($this->localStack);
        $this->removeCdnUrl();
        $this->removeInternalDomainPattern();
        // Set the merevo default config
        $this->setMerevoClientEnvVariables();
    }

    /**
     * Set all the variables in order to work in production
     */
    protected function setEnvVariablesForProduction()
    {
        $this->setDeploymentEnvironment('production');
        $this->setUrlEnvVariables('production');
        $this->removeCdnUrl();
        $this->removeInternalDomainPattern();
        // In production, for integrators, all variables should have been setted.
        // So we don't need to set clientId, ... variables
    }

    /**
     * Set all the url variables
     * @param $stackName
     */
    protected function setUrlEnvVariables($stackName)
    {
        switch ($stackName) {
            case "production":
                $url = "https://api-gateway.lead.fm";
                break;
            case "test":
                $url = "http://localhost-api-gateway";
                break;
            default:
                $url = "https://$stackName-api-gateway.dev.lead.fm";
                break;
        }
        $this->setEnvVariable('bridge_front_api.services.api.default_url', $url.'/fo-lts/v:ltsVersion/:serviceName');
    }

    /**
     * Set all the merevo default configurations
     */
    protected function setMerevoClientEnvVariables()
    {
        $this->setEnvVariable("bridge_front_api.services.api.client_id", self::DEV_MEREVO_CLIENT_ID);
        $this->setEnvVariable("bridge_front_api.services.api.front_office_id", self::DEV_MEREVO_FRONT_OFFICE_ID);
        $this->setEnvVariable("bridge_front_api.services.api.bearer", self::DEV_MEREVO_BEARER);
        $this->setEnvVariable("bridge_front_api.services.algolia.application_id", self::DEV_MEREVO_ALGOLIA_APP_ID);
        $this->setEnvVariable("bridge_front_api.services.algolia.api_key", self::DEV_MEREVO_ALGOLIA_API_KEY);
    }

    /**
     * Set the deployment environment
     * @param $environment
     */
    protected function setDeploymentEnvironment($environment)
    {
        $this->setEnvVariable("bridge_front_core.environment", $environment);
    }

    /**
     * Remove the CDN base url
     */
    protected function removeCdnUrl()
    {
        $this->setEnvVariable("bridge_front_starter_kit.cdn_base_url", "");
    }

    /**
     * Remove the app hostname pattern
     */
    protected function removeInternalDomainPattern()
    {
        $this->setEnvVariable("bridge_front_starter_kit.internal_domain_pattern", "");
    }

    /**
     * Set the variable just if it's unset
     *
     * @param $symfonyParameter
     * @param $value
     */
    protected function setEnvVariable($symfonyParameter, $value)
    {
        // If the config has this parameter
        if ($this->container->hasParameter($symfonyParameter)) {
            // Get the parameter
            $parameter = $this->getParameterFromConfig($symfonyParameter);

            if (strpos($parameter, '%') !== FALSE) {
                // If the value is unset, set it properly
                $this->container->setParameter($symfonyParameter, $value);
            }
        }
    }

    /**
     * @param $parameterName
     * @return mixed
     */
    protected function getParameterFromConfig($parameterName)
    {
        return $this->container->getParameter($parameterName);
    }
}
