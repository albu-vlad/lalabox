
# LalaBox
####Blazing fast 3 min Environment install
> An electron-vue project

#### About

Lalabox is a one click Drupal environment installer wrapped around [Lando](https://github.com/lando/lando) and build with [electron-vue](https://github.com/SimulatedGREG/electron-vue). Lalabox provides an quick environment ready for development, configured with a standard profile and an installed database.
It essentially runs a series of bash commands that clone drupal-composer project and composer.phar locally, initialises lando and uses drush to run a site install with db.


#### Prerequisites:

1. [Docker](https://www.docker.com)
2. [Lando](https://github.com/lando/lando)

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---
