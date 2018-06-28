'use strict'

import { app, BrowserWindow } from 'electron'
const fs = require('fs')
const execSync = require('child_process').execSync
const home = app.getPath('home')
const appProjPath = home + '/Drupal8Projects/'
const content = '{ "pages": [] }'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768,
    useContentSize: true,
    width: 1150,
    resizable: false
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createProjFolder () {
  if (!fs.existsSync(appProjPath)) {
    fs.mkdirSync(appProjPath)
    fs.mkdirSync(appProjPath + 'lando-recipe')
    execSync('git clone https://github.com/albu-vlad/lando-drupal8-recipe.git ' + appProjPath + 'lando-recipe')
    fs.writeFileSync(appProjPath + 'db.json', content)
  }
  if (!fs.existsSync(appProjPath + 'lando-recipe')) {
    fs.mkdirSync(appProjPath + 'lando-recipe')
    execSync('git clone https://github.com/albu-vlad/lando-drupal8-recipe.git ' + appProjPath + 'lando-recipe')
  }
}

app.on('ready', createWindow)
app.on('ready', createProjFolder)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
