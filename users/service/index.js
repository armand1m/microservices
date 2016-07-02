'use strict';

const Database = require('./lib/database');
const Server = require('./lib/server');
const Events = require('./lib/events');

function onServerReady(server) {
  Events.onServerRunning(server);

  server
  .register()
  .then(Events.onServiceRegistered)
  .then(setTerminationHandler)
  .catch(Events.onServiceRegisterError);

  function setTerminationHandler() {
    ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal =>
      process.on(signal, () =>
        server
        .unregister()
        .then(Events.onServiceUnregistered)
        .then(Events.doSafeExit)
        .catch(Events.onServiceUnregistered)
      )
    )
  }
}

function onDatabaseReady() {
  new Server()
  .configure()
  .start()
  .then(onServerReady)
  .catch(Events.doErrorExit);
}

Database
.dbReady()
.then(onDatabaseReady)
.catch(Events.doErrorExit);
