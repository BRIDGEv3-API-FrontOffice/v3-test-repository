# Integrators

## Prerequisites

For the prerequisites, please read the [readme file](./README.md).

## Configuration

To initialize your project, please follow the steps below:

### Set production parameters

1. Set list of locale enabled according to client languages.
    ```yml
    # app/config/parameters.yml.dist
    bridge_front_starter_kit.locales:
        - en
        - fr
    ```
    > NOTE: Remove all unused localised parameters and translations files.

2. Set the client's store locator domains (without protocol).
    ```yml
    # app/config/parameters.yml.dist
    bridge_front_starter_kit.external_domains:
        -
            host: shop.com
            locale: en
        -
            host: magasin.com
            locale: fr
    ```

3. They are 5 required parameters in order to to begin to work, given by developpers.
    ```yml
    # app/config/parameters.yml.dist
    bridge_front_api.services.api.client_id
    bridge_front_api.services.api.front_office_id
    bridge_front_api.services.api.bearer
    bridge_front_api.services.algolia.application_id
    bridge_front_api.services.algolia.api_key
    ```

4. Generate a Symfony secret phrase.
    ```yml
    # app/config/parameters.yml.dist
    secret: 'Please_Modify_Me_123456789ABCDEFGHIJKLMN'
    ```

### Set front parameters

1. Set theme name and icon set
    ```yml
    # app/config/parameters_front.yml
    bridge_front_starter_kit.front_theme: 'Essential'
    bridge_front_starter_kit.icon_set: 'essential'
    ```

    ```javascript
    // webpack.config.js
    const FRONT_THEME = 'Essential';
    ```

2. Set default locale
    ```yml
    # app/config/parameters_front.yml
    bridge_front_starter_kit.default_locale: en
    ```

3. Set search configuration
    ```yml
    # app/config/parameters_front.yml
    bridge_front_core.services.api.geocoding.provider: 'gmap'
    ```
    Set the geocoding provider used by the search. It is set to `gmap` by default. :warning: `mappy` only works on locations in France and only in France.

    ```yml
    # app/config/parameters_front.yml
    bridge_front_starter_kit.search.country:
        - gb
        - us
        - fr
    ```
    Don't forget to update countries for autocomplete according to client locations places.

4. GDPR configuration
    ```yml
    # app/config/parameters_front.yml
    bridge_front_starter_kit.gdpr_links:
        cookies:
            en:
                label: 'Cookies info'
                url: '/gdpr/cookies'
    ```
    This is the minimum configuration for gdpr links, `cookies` is required for cookies consent.

### Set theme parameters

1. Set client colors and buttons shape
    ```yml
    # app/config/parameters_theme.yml
    bridge_front_theme.colors:
        primary: '#333333'
        secondary: '#eeeeee'
        tertiary: '#a1aeb7'
    bridge_front_theme.buttons.shape: 'squared'
    bridge_front_theme.buttons.outlined: false
    ```

2. Import SVG files for map markers in `web/assets/images/markers` and set configuration in `bridge_front_theme.map.markers.icons`.

### Optimum header and footer configuration

Header and footer configuration is set respectively in `parameters_header.yml` and `parameters_footer.yml`.

## Development

### Start the project

1. Install all dependencies
    ```bash
    npm run init-vendors
    ```
    It will copy parameters, install node packages, install composer dependencies and install bower packages.

2. Launch project
    ```bash
    npm run watch
    ```
    It will build all assets and watch for changes.

    ```bash
    php bin/console server:run
    ```
    It will start Symfony php server on http://localhost:8000.

    > NOTE: To serve on a different port run `php bin/console server:run --port 8001`.

    > NOTE: To share your local server run `php bin/console server:run YOUR_IP_ADDRESS` and browse to http://YOUR_IP_ADDRESS:8000.

### Commit process

1. Create your own branch to work on it.

2. Use commit naming conventions describe in [README.md](./README.md#commit-conventions).

3. Check the validity of your code with `npm run validate`.

4. Push your branch to the client repository and create a new pull request from your branch to `master`.

    > NOTE: Before pushing your branch, fetch and rebase `master` branch.

5. Once all tests have passed, ask for review, then merge your branch.

6. Ask an `fo-leads` for deploy on production front.

## Create a new theme

1. Create a new bundle folder for your theme in `src/Bridge/Theme`. The name should end with `Bundle`, for example `AwesomeBundle`. This folder need this structure to work:
    ```
    AwesomeBundle
    |-- Resources
    |   |-- config
    |   |   `-- theme.yml
    |   |-- scripts
    |   |   `-- ...
    |   |-- style
    |   |   `-- ...
    |   `-- views
    |       |-- components
    |       |   `-- .gitkeep
    |       |-- pages
    |       |   |-- exceptions
    |       |   |   |-- error.html.twig
    |       |   |   |-- error404.html.twig
    |       |   |   |-- index.js
    |       |   |   `-- style.scss
    |       |   |-- gdpr
    |       |   |   |-- index.js
    |       |   |   |-- style.scss
    |       |   |   `-- template.html.twig
    |       |   |-- geo-divisions
    |       |   |   |-- index.js
    |       |   |   |-- style.scss
    |       |   |   `-- template.html.twig
    |       |   |-- home
    |       |   |   |-- index.js
    |       |   |   |-- style.scss
    |       |   |   `-- template.html.twig
    |       |   |-- location
    |       |   |   |-- index.js
    |       |   |   |-- style.scss
    |       |   |   `-- template.html.twig
    |       |   `-- results
    |       |       |-- index.js
    |       |       |-- style.scss
    |       |       `-- template.html.twig
    |       `-- base.html.twig
    `-- BridgeThemeAwesomeBundle.php
    ```

2. In the file `BridgeThemeAwesomeBundle.php`, place this content:
    ```php
    // src/Bridge/Theme/AwesomeBundle/BridgeThemeAwesomeBundle.php
    <?php

    namespace Bridge\Theme\AwesomeBundle;

    use Symfony\Component\HttpKernel\Bundle\Bundle;

    class BridgeThemeAwesomeBundle extends Bundle
    {
    }

    ```

3. Create a `translations` folder in `app/Resources/BridgeThemeAwesomeBundle`. It is possible to add a `.gitkeep` file so that git keeps the empty folder.

4. Add AwesomeBundle in Symfony kernel.
    ```php
    // app/AppKernel.php

    // ...
    $bundles = [
        // Project bundles
        new Bridge\Theme\AwesomeBundle\BridgeThemeAwesomeBundle(),
    ];
    // ...
    ```

5. Record AwesomeBundle in composer.
    ```json
    // composer.json
    // ...
    "autoload": {
        "psr-4": {
            "Bridge\\Theme\\AwesomeBundle\\": "src/Bridge/Theme/AwesomeBundle"
        }
    },
    // ...
    ```
    Then run `composer install`.

## Switch theme

1. Set theme in parameters and webpack configuration.
    ```yml
    # app/config/parameters_front.yml
    bridge_front_starter_kit.front_theme: 'Awesome'
    ```

    ```javascript
    // webpack.config.js
    const FRONT_THEME = 'Awesome';
    ```

2. Set theme for linter and tests.
    ```json
    // package.json
    "lint:templates": "php bin/console lint:twig @BridgeComponentsBundle && php bin/console lint:twig @BridgeThemeAwesomeBundle",
    "lint:config": "php bin/console lint:yaml @BridgeThemeAwesomeBundle",
    ```

    ```php
    // tests/Bridge/FrontBundle/DependencyInjection/BridgeFrontExtensionTest.php
    $container->setParameter('bridge_front_starter_kit.front_theme', 'Awesome');
    ```

---

**INFO:** It's possible to change the language by adding the parameters `?_locale=fr`_('fr' is french for example)_ at the end of browser URL. Works in all environments.
_Note:_ If you work with `localhost` it's better to clear the browser cache after the language change.

**WARNING:** Everytime you want to add a new parameter in `parameters.yml`, add it to `parameters.yml.dist` too.

**WARNING:** Don't touch nor update the values inside the file [parameters_common.yml](./app/config/parameters_common.yml) because they are setted from Kubernetes.

**WARNING:** The variable `bridge_front_starter_kit.local_development_stack` should remain `production`, because you are working with production data.

Thanks a lot and happy coding!
