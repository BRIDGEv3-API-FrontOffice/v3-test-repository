<?php
namespace Tests\Bridge\FrontBundle;

trait AccessibleTrait
{
    protected function setMethodAccessible($method)
    {
        $reflexionMethod = new \ReflectionMethod(get_class($this->getTestSubject()), $method);
        $reflexionMethod->setAccessible(true);
        return $reflexionMethod;
    }

    /**
     * @param string $methodName method name
     * @param mixed $parameters,... Method parameters
     */
    protected function invokePrivateMethod($methodName, ...$parameters)
    {
        $method = $this->setMethodAccessible($methodName);
        array_unshift($parameters, $this->getTestSubject());
        return call_user_func_array([$method, 'invoke'], $parameters);
    }

    abstract public function getTestSubject();
}
