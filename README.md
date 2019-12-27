# bridge-front-starter-kit

[![Coverage Status](https://coveralls.io/repos/github/Leadformance/bridge-front-starter-kit/badge.svg?branch=master&t=iltfFb)](https://coveralls.io/github/Leadformance/bridge-front-starter-kit?branch=master)
[![Build Status](https://travis-ci.com/Leadformance/bridge-front-starter-kit.svg?token=eeQYrVYUBsjkTKz6YcrW&branch=master)](https://travis-ci.com/Leadformance/bridge-front-starter-kit)

## Prerequisites

Please follow the [wiki](https://github.com/Leadformance/bridge-front-starter-kit/wiki) for prerequisites before continuing.  
* Minimum and Maximum Node version required: **6.17.1**
* Minimum and Maximum NPM version required: **3.10.10**
* Minimum PHP version required: **7.1**

## Getting started

If you are an integrator, please read [this file](./README-integrators.md).
However, if you are a developer / contributor, please read [this file](./README-developers.md).

## Starting the server

To start the server, use this command:
```bash
php bin/console server:run
```

Launch webpack to build assets for any modifications:
```bash
webpack --watch
```

Browse http://localhost:8000

## Commands

`npm run init-vendors` will run `npm install`, `bower install` and `composer install -n` commands.  
`npm install` will install node packages.  
`bower install` will install bower packages.  
`composer install -n` will install the exact composer dependencies versions set in this file `composer.lock`  
`composer update -n` will install the latest composer dependencies versions as defined in `composer.json`

## Translations
The following command will add missing translations and clean the ones that are not used anymore.
```bash
# php bin/console trans:update --force --clean <locale> <bundle>
php bin/console trans:update --force --clean en BridgeFrontBundle
```
Existing bundles: `BridgeFrontBundle`, `BridgeFrontCoreBundle`

## Tests
In order to test your php, run:
```bash
npm run test:php
```

If you want to test a specific method, run:
```bash
phpunit --filter testSearchAction
```

Before pushing your code to github, make sure this command passes:
```bash
npm run validate
```

## Web Performance Audits

Automated Audits are run by our CI.

Audits runs on default pages (`/` and `/search`), and audit reports are accessible on Github Pull request.

If you want to audit others pages, please add them into `webPerformanceAudits.urls` in `package.json` file.

Example : 

```json
"webPerformanceAudits": {
  "urls": [
    "/1-my-location",
    "/2-another-location"
  ]
}
```

## Browser Support

Uncomment line 120 in `webpack.config.js` to enable IE8 & IE9 compatibility.

## Commit conventions

Commit message are linted using [commitlint](https://github.com/marionebl/commitlint).  
The rules are based on [config-conventional](https://www.npmjs.com/package/@commitlint/config-conventional) with some overrides in [package.json](./package.json)

### Here are the main rules :

- Start the commit name with one of these words (in lowercase) followed with colon (`:`) :

```
[
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "release",
  "style",
  "test"
]
```

- After you have to write your subject (in lower case too)
- All the commit header must contain less than 72 characters

### Here are some examples :

❌ `mot`  
❌ `refactor`  
❌ `refactor: Uppercase`  
✔️ `refactor: lowercase`  
❌ `feat: a very long senteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeence`  
❌ `feat: with a dot.`  

✔️
```
chore: multi

lines
```

❌
```
feat: no
blank
lines
```

✔️
```
feat: some

space and
blank
lines

optional footer
```

