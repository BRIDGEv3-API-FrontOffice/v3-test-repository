# Developers

## Prerequisites

For the prerequisites, please read the [readme file](./README.md).

## Getting started

**If your project has already been initialized, go directly to step 5**  

To initialize your project, please follow the steps below:  

1. If you want to work in local using a specific kubernetes dev stack, modify this variable: (`bridge_front_starter_kit.local_development_stack`) inside your `app/config/parameters.yml` file.
For instance, to plug your local front on the `support` stack, just put this:
```yaml
parameters:
    bridge_front_starter_kit.local_development_stack: support
```

2. Run this command in order to install every dependencies:
```bash
npm run init-vendors
```
It will copy parameters, install node packages, install composer dependencies and install bower packages.

3. (Optional): If you want to test your starter-kit for a different client / settings, you can modify these parameters inside your `app/config/parameters.yml` file.
- bridge_front_api.services.api.client_id
- bridge_front_api.services.api.front_office_id
- bridge_front_api.services.api.bearer
- bridge_front_api.services.algolia.application_id
- bridge_front_api.services.algolia.api_key
- bridge_front_starter_kit.locales

**INFO:** `bridge_front_starter_kit.locales` list of locale enabled. This parameter dynamically adds internal domains.
For exemple in preview with `[fr, en]` :
- *clientName*-pr-123-fr.v3.leadformance.com
- *clientName*-pr-123-en.v3.leadformance.com

4. (Optional): If you want to plug your starter-kit to a local stack, just take the local project url you are working on and place it inside your `app/config/parameters.yml` file.
If you want the list of the default values, read the [parameters_common.yml file](./app/config/parameters_common.yml).

**INFO:** It's possible to change the language by adding the parameters `?_locale=fr`_('fr' is french for example)_ at the end of browser URL. Works in all environments.
_Note:_ If you work with `localhost` it's better to clear the browser cache after the language change.

## Manage local errors
If you have some errors like that:
```
[Symfony\Component\DependencyInjection\Exception\ParameterNotFoundException]
  You have requested a non-existent parameter "algolia.application_id". Did y
  ou mean this: "bridge_front_api.services.algolia.application_id"?
```

Don't forget to plug your env into a devlopment stack like this (or update all the values you need inside your [parameters.yml file](./app/config/parameters.yml):
```yaml
parameters:
    bridge_front_starter_kit.local_development_stack: support
```

## Commit process

If you have to work on the starter-kit, create your own branch and work on it.
When your development is finished, fetch and rebase `master` branch and push your code.
Then create a pull request from your branch to `master`.
