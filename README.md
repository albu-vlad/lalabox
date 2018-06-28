
# LalaBox
#### Blazing fast 5 min Environment install for Drupal8
> An electron-vue project

* [Download for osx](https://github.com/albu-vlad/lalabox/raw/master/source/Lalabox-0.0.0.dmg)
* [Download for ubuntu 17](https://github.com/albu-vlad/lalabox/blob/master/source/Lalabox-0.0.0-x86_64.AppImage)

- ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) This is WIP: There will be dragons!

![LalaBox demo](https://github.com/albu-vlad/lalabox/blob/master/Demo/Demo.png)

#### About

Lalabox is a one click Drupal8 environment installer wrapped around [Lando](https://github.com/lando/lando) and build with [electron-vue](https://github.com/SimulatedGREG/electron-vue). Lalabox provides a quick environment ready for development, configured with a standard profile and an installed database.
It essentially runs a series of bash commands that clone drupal-composer project locally, initialises lando and uses [Drupal Console](https://github.com/hechoendrupal/drupal-console) to run a site install with db.

You can find your projects in "/Users/username/Drupal8Projects".


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
