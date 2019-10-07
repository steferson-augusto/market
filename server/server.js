'use strict'

/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstraps Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass a relative path from the project root.
*/

// POSTGRES
// HOST=localhost
// PORT=3333
// NODE_ENV=development
// APP_NAME=Mercadoonline
// APP_URL=http://${HOST}:${PORT}
// CACHE_VIEWS=false
// APP_KEY=J09jamR6VsjkaWS6NPmLe6eU1TjSjUVl
// DB_CONNECTION=pg
// DB_HOST=127.0.0.1
// DB_PORT=5432
// DB_USER=postgres
// DB_PASSWORD=root
// DB_DATABASE=mercado-online
// HASH_DRIVER=bcrypt
// MAIL_CONNECTION=smtp
// SMTP_HOST=smtp.mailtrap.io
// MAIL_USERNAME=5696878b0752b1
// MAIL_PASSWORD=8704379a5625ec

// FB_CLIENT_ID=420398128570280
// FB_CLIENT_SECRET=f2be02d8cfc7ae67308cbe5781698fa5

// GOOGLE_CLIENT_ID=743673046912-1a4k3jej7fg8p5k16lsptg0vrd77t4um.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=itMlz3rX19gDw9UpYwNxteO-



// MYSQL
// HOST=localhost
// PORT=3333
// NODE_ENV=development
// APP_NAME=Mercadoonline
// APP_URL=http://${HOST}:${PORT}
// CACHE_VIEWS=false
// APP_KEY=J09jamR6VsjkaWS6NPmLe6eU1TjSjUVl
// DB_CONNECTION=mysql
// DB_HOST=127.0.0.1
// DB_PORT=3306
// DB_USER=root
// DB_PASSWORD=
// DB_DATABASE=mercado-online
// HASH_DRIVER=bcrypt
// MAIL_CONNECTION=smtp
// SMTP_HOST=smtp.mailtrap.io
// MAIL_USERNAME=5696878b0752b1
// MAIL_PASSWORD=8704379a5625ec

// FB_CLIENT_ID=420398128570280
// FB_CLIENT_SECRET=f2be02d8cfc7ae67308cbe5781698fa5

// GOOGLE_CLIENT_ID=743673046912-1a4k3jej7fg8p5k16lsptg0vrd77t4um.apps.googleusercontent.com
// GOOGLE_CLIENT_SECRET=itMlz3rX19gDw9UpYwNxteO-


const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .fireHttpServer()
  .catch(console.error)
