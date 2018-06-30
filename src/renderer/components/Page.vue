<template>
    <div class="page">
        <div v-if="page">
            <div class="page-content">
                <div class="material">
                    <input type="text" v-model="page.title" class="title" name="title" placeholder="Set Project Name"/>
                    <hr>
                    <label>Project Title</label>
                </div>
                <div class="errors" v-if="page.formErrors.length">
                    <ul>
                        <li v-for="error in page.formErrors">{{ error }}</li>
                    </ul>
                </div>
                <div>
                    <div class="messages"><label>Drupal Composer Clone: </label><span class="setup-message">{{page.drupalComposerMessage}}</span></div>
                    <div class="messages" v-if="loaderShow === 'loader1'"><hollow-dots-spinner
                            :animation-duration="2000"
                            :dot-size="12"
                            :dots-num="5"
                            color="#2962ff"
                    /></div>
                    <div class="messages"><label>Lando Init: </label><span class="setup-message">{{page.landoInitMessage}}</span></div>
                    <div class="messages" v-if="loaderShow === 'loader2'"><hollow-dots-spinner
                            :animation-duration="2000"
                            :dot-size="12"
                            :dots-num="5"
                            color="#2962ff"
                    /></div>
                    <div class="messages"><label>Composer Install: </label><span class="setup-message">{{page.composerInstallMessage}}</span></div>
                    <div class="messages" v-if="loaderShow === 'loader3'"><hollow-dots-spinner
                            :animation-duration="2000"
                            :dot-size="12"
                            :dots-num="5"
                            color="#2962ff"
                    /></div>
                    <div class="messages"><label>Project Info: </label>
                        <div class="proj-info-container" v-if="projectInfo">
                            <div class="proj-info">
                                <p class="p-class">Project Urls: </p>
                                <span v-html="projectInfo.projectUrls"></span>
                            </div>
                            <div class="proj-info">
                                <p class="p-class">Db Credentials: </p>
                                <span v-html="projectInfo.dbCredentials"></span>
                            </div>
                            <div class="proj-info">
                                <p class="p-class">Db Connection: </p>
                                <span v-html="projectInfo.dbConnection + ' ' + projectInfo.dbType"></span>
                            </div>
                            <div class="proj-info">
                                <p class="p-class">Pma Urls: </p>
                                <span v-html="projectInfo.pmaUrls"></span>
                            </div>
                        </div>
                    </div>
                    <div class="messages" v-if="loaderShow === 'loader5'"><hollow-dots-spinner
                            :animation-duration="2000"
                            :dot-size="12"
                            :dots-num="5"
                            color="#2962ff"
                    /></div>
                    <div class="messages"><label>Project Credentials: </label><span class="setup-message" v-html="projectCredentials"></span></div>
                    <div class="messages" v-if="loaderShow === 'loader6'"><hollow-dots-spinner
                            :animation-duration="2000"
                            :dot-size="12"
                            :dots-num="5"
                            color="#2962ff"
                    /></div>
                    <div class="messages"><label>Project Status: </label><span class="setup-message">{{page.projectStartMessage}}</span></div>
                    <div class="messages" v-if="loaderShow === 'loader7'"><hollow-dots-spinner
                            :animation-duration="2000"
                            :dot-size="12"
                            :dots-num="5"
                            color="#2962ff"
                    /></div>
                </div>
                <div class="proj-buttons">
                    <button class="delete-proj" @click="deletePage()" :disabled="disableButtons"><icon class="spinner-stop" name="spinner" pulse></icon>Delete Project</button>
                    <button type="submit" @click="savePage()" :disabled="disableButtons"><icon class="spinner-stop" name="spinner" pulse></icon>Create Project</button>
                    <button @click="stop()" :disabled="disableButtons"><icon class="spinner-stop" name="spinner" pulse></icon>Stop Project</button>
                    <button @click="start()" :disabled="disableButtons"><icon class="spinner-stop" name="spinner" pulse></icon>Start Project</button>
                </div>
            </div>
            <div v-if="disableButtons === true">
                <div id="overlay"></div>
            </div>
        </div>
        <div v-else>
            <section>
                <div class="center-section">
                    <span class="app-title"><h1>Lalabox</h1></span>
                    <hr>
                    <h2>Lalabox is a one click Drupal environment installer wrapped around Lando and build on electron-vue.
                    </h2>
                </div>

            </section>
        </div>
    </div>
</template>
<script>
  import 'vue-awesome/icons/spinner'
  import Icon from 'vue-awesome/components/Icon'
  import HollowDotsSpinner from 'epic-spinners/src/components/lib/HollowDotsSpinner'
  import OrbitSpinner from 'epic-spinners/src/components/lib/OrbitSpinner'

  const remote = require('electron').remote
  const app = remote.app
  var home = app.getPath('home')
  var exec = require('child_process').exec
  var tableify = require('tableify')
  const fs = require('fs')

  const low = require('lowdb')
  const FileSync = require('lowdb/adapters/FileSync')
  var appProjPath = home + '/Drupal8Projects/'
  const adapter = new FileSync(appProjPath + 'db.json')
  const db = low(adapter)

  export default {
    name: 'Page',
    props: ['page'],
    data () {
      return {
        loaderShow: 'default',
        disableButtons: false
      }
    },
    computed: {
      projectInfo: function () {
        if (this.page.projectInfoMessage !== '') {
          var info = JSON.parse(this.page.projectInfoMessage)
          if (info.appserver) {
            var projectUrls = tableify(info.appserver.urls)
            var dbCredentials = tableify(info.database.creds)
            var dbConnection = tableify(info.database.internal_connection)
            var dbType = tableify(info.database.type)
            if (info.pma) {
              var pmaUrls = tableify(info.pma.urls)
            }
            return {'projectUrls': projectUrls, 'dbCredentials': dbCredentials, 'dbType': dbType, 'dbConnection': dbConnection, 'pmaUrls': pmaUrls}
          }
        }
      },
      projectCredentials: function () {
        if (this.page.projectCredentials !== '') {
          return '<div> Installed Drupal site and database </div><div> User: admin</div><div> Password: admin</div>'
        }
      }
    },
    methods: {
      deletePage () {
        this.$emit('delete-page')
      },
      buttonEnabled (boolToggle) {
        if (boolToggle) {
          return boolToggle
        }
      },
      savePage () {
        if (!fs.existsSync('/usr/local/bin/lando')) {
          alert('lando is required Aborting!')
        } else if (!fs.existsSync('/usr/bin/git')) {
          alert('git is required Aborting!')
        } else {
          // @TODO os specifics
          var projName = this.page.title
          var projPath = appProjPath + projName
          if (!this.page.title) return this.page.formErrors.push('Field is required')
          if (/\s/.test(this.page.title)) return this.page.formErrors.push('Project name must not contain white spaces')
          if (this.page.edit === 0) {
            return this.page.formErrors.push('Project cannot be edited, to modify please delete and recreate')
          } else {
            db.get('pages')
              .push(this.page)
              .write()
            var self = this
            this.disableButtons = true
            this.loaderShow = 'loader1'
            this.drupalClone(projPath).then(function (result) {
              self.page.drupalComposerMessage = 'Drupal-composer cloned'
              self.page.edit = 0
              self.loaderShow = 'loader2'
              self.landoInit(projPath, projName).then(function (result) {
                self.page.landoInitMessage = 'Cloned and configured lando recipe template '
                self.loaderShow = 'loader3'
                self.composerInstall(projPath).then(function (result) {
                  self.page.composerInstallMessage = 'Executed composer install'
                  self.loaderShow = 'loader4'
                  self.landoInfo(projPath).then(function (info) {
                    self.page.projectInfoMessage = info
                    self.loaderShow = 'loader5'
                    self.landoDatabase(projPath).then(function (credentials) {
                      self.loaderShow = 'loader6'
                      self.page.projectCredentials = credentials
                    }).then(function (result) {
                      self.landoStop(projPath).then(function (test) {
                        self.page.projectStartMessage = 'stopped'
                        db.get('pages').write()
                        self.disableButtons = false
                        self.loaderShow = 'default'
                      })
                    })
                  })
                })
              })
            })
          }
        }
      },
      stop () {
        var self = this
        self.loaderShow = 'loader7'
        self.disableButtons = true
        this.startProj().then(function (test) {
          self.page.projectStartMessage = 'stopped'
          self.disableButtons = false
          self.loaderShow = 'default'
        })
      },
      stopProj () {
        var self = this
        var projName = this.page.title
        var projPath = appProjPath + projName
        return new Promise(function (resolve, reject) {
          self.buttonEnabled(true)
          exec('cd ' + projPath + ' && /usr/local/bin/lando stop', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = 'drupal clonedrrr'
            resolve(data)
          })
        })
      },
      start () {
        var self = this
        self.loaderShow = 'loader7'
        self.disableButtons = true
        this.startProj().then(function (test) {
          self.page.projectStartMessage = 'started'
          self.disableButtons = false
          self.loaderShow = 'default'
        })
      },
      startProj () {
        var self = this
        var projName = self.page.title
        var projPath = appProjPath + projName

        return new Promise(function (resolve, reject) {
          exec('cd ' + projPath + ' && /usr/local/bin/lando start', {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = 'drupal clonedrrr'
            resolve(data)
          })
        })
      },
      drupalClone (projPath) {
        return new Promise(function (resolve, reject) {
          exec('git clone https://github.com/drupal-composer/drupal-project.git ' + projPath, {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = 'drupal clonedrrr'
            resolve(data)
          })
        })
      },
      landoInit (projPath, projName) {
        return new Promise(function (resolve, reject) {
          exec('cd ' + appProjPath + 'lando-recipe && cp .lando.yml ' + projPath + ' && cd ' + projPath + ' && sed -i -e \'s/{%project_name%}/' + projName + '/g\' .lando.yml && /usr/local/bin/lando start', {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = 'composer install executed'
            resolve(data)
          })
        })
      },
      composerInstall (projPath) {
        return new Promise(function (resolve, reject) {
          exec('cd ' + projPath + ' && /usr/local/bin/lando composer install', {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = 'composer install executed'
            resolve(data)
          })
        })
      },
      landoStop (projPath) {
        return new Promise(function (resolve, reject) {
          exec('cd ' + projPath + ' && /usr/local/bin/lando stop', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = '/usr/local/bin/lando start'
            resolve(data)
          })
        })
      },
      landoInfo (projPath) {
        return new Promise(function (resolve, reject) {
          exec('cd ' + projPath + ' && /usr/local/bin/lando info', {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = stdout.substr(stdout.indexOf('{'))
            resolve(data)
          })
        })
      },
      landoDatabase (projPath) {
        var that = this
        return new Promise(function (resolve, reject) {
          exec('cd ' + projPath + '/web && /usr/local/bin/lando drupal site:install standard' +
            ' --site-name "' + that.page.title + '" --db-type mysql --db-port 3306 --db-user drupal8 --db-pass drupal8' +
            ' --db-host database --db-name drupal8 --langcode en --site-mail admin@example.com' +
            ' --account-name admin --account-mail admin@example.com --account-pass admin --no-interaction'
            , {maxBuffer: 1024 * 500}, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`)
            }
            var data = stdout
            resolve(data)
          })
        })
      }
    },
    components: {
      Icon,
      HollowDotsSpinner,
      OrbitSpinner
    }
  }
</script>
<style lang="scss" scoped>


    .page {
        width: 100%;
        height: 100vh;
        transition: 0.3s;
        padding-left: 1rem;
        padding-right: 1rem;
        font-weight: 400;
        .page-content {
            padding: 2rem;
        }
        #overlay {
            position:fixed;
            width:100%;
            height:100%;
            left:0;
            top:0;
            z-index:100000;
        }
        .proj-info {
            text-align: left;
            position: relative;
            float: left;
            color: #c8cdd0;
            border-left: 2px solid #415058;
            padding: 10px;


            .p-class {
                font-weight: 600;
                margin: 0px;

            }

        }
        .messages {
            float: left;
            width: 100%;
            height: 100%;
        }

        .errors{
            text-align: center;
            color: #ee2b2b;
            padding: 0.5rem 0.5rem;
            margin: 0.5rem;
            ul {
                list-style-type: none;
                border: 2px solid #ee2b2b;
                background-color: #FFBABA;
                padding: 0.5rem 0.5rem;
                margin: 0.5rem;
                border-radius: 0.25rem;
            }
        }

        section{
            max-width: 600px;
            height: 100%;
            top:0;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            margin-top: 35%;
            margin-left: 10%;

            h1{
                color: #c8cdd0;
                font-weight: 300;
                font-size: 3rem;
                margin-bottom: 5px;
                text-align: center;
                font-weight: bold;
            }

            hr {
                content: '';
                display: block;
                position: absolute;
                bottom: 0;
                left: 0;
                margin: 0;
                padding: 0;
                width: 100%;
                height: 2px;
                border: none;
                font-size: 1px;
                will-change: transform, visibility;
                transition: all 200ms ease-out;
                z-index: 10;
            }

            h2{
                font-weight: 300;
                font-size: 1rem;
                margin-bottom: 40px;
                color: #c8cdd0;
            }

        }

    }

    .title {
        font-size: 1rem;
        padding: 0.5rem 1rem;
    }

    label {
        top: 10px;
        left: 10px;
        font-size: 1rem;
        color: #415058;
        font-weight: 600;
    }

    button {
        border-style: none;
        padding: 0.5rem 0.75rem;
        margin: 0.5rem;
        border-radius: 0.25rem;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        border: 2px solid rgba(255,255,255,0.4);
        background-color: #000;

        &:focus {
            outline: none;
        }

        & > .spinner-stop {
            display: none;
        }

        &:hover {
            &.delete-proj {
                background-color: #ee2b2b;
                border-color: #ee2b2b;
            }
            background-color: #2962ff;
            border-color: #2962ff;
        }

        &:active {
            background-color: #2962ff;
            border-color: #2962ff;
            &.delete-proj {
                background-color: #ee2b2b;
                border-color: #ee2b2b;
            }
            & > .spinner-stop {
                margin-right: 0.5rem;
                display: inline;
            }
            > .content {
                display: inline;
            }
        }
    }

    .fa-icon {
        margin-right: 0.5rem;
    }

    .setup-message {
        font-size: 1rem;
        color: #c8cdd0;
    }

    .messages {
        padding: 0.5rem;
    }

    .material {
        position: relative;
        padding: 0;
        margin: 5px;
        border: none;
        overflow: visible;
        width: 100%;

        input {
            box-sizing: border-box;
            width: 100%;
            padding: 12px 10px 8px;
            border: none;
            border-radius: 0;
            box-shadow: none;
            border-bottom: 1px solid #2962ff;
            font-size: 120%;
            outline: none;
            cursor: text;
            background-color: transparent;
            color: #fff;
            font-weight: 600;
        }

        hr {
            content: '';
            display: block;
            position: absolute;
            bottom: 0;
            left: 0;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 2px;
            border: none;
            background: #2962ff;
            font-size: 1px;
            will-change: transform, visibility;
            transition: all 200ms ease-out;
            z-index: 10;
        }

        label {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 1rem;
            color: #F2F2F3;
            text-transform: uppercase;
            font-weight: 500;
            transform-origin: 0 -150%;
            transition: transform 300ms ease;
            pointer-events: none;
        }
        input:focus ~ label,
        input:valid ~ label {
            transform: scale(0.6);
        }
    }

</style>