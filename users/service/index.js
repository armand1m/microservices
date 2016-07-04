'use strict';

const Database = require('./lib/database');
const Server = require('./lib/server');
const Events = require('./lib/events');

function setTerminationHandler(server) {
  ['SIGINT', 'SIGTERM', 'SIGUSR2'].forEach(signal =>
    process.on(signal, () =>
      server
      .unregister()
      .then(Events.onServiceUnregistered)
      .then(Events.doSafeExit)
      .catch(Events.onServiceUnregisterError)
    )
  )
}

function onServerReady(server) {
  server
  .register()
  .then(Events.onServiceRegistered)
  .then(setTerminationHandler.bind(this, server))
  .catch(Events.onServiceRegisterError);

  return server;
}

function onDatabaseReady() {
  new Server()
  .configure()
  .start()
  .then(onServerReady)
  .then(Events.onServerRunning)
  .catch(Events.doErrorExit);
}

Database
.dbReady()
.then(onDatabaseReady)
.catch(Events.doErrorExit);
