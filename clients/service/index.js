'use strict';

const Hapi = require('hapi');
const Client = require('./model');
const consul = require('./consul');

class ClientService {
  constructor() {
    this.server = new Hapi.Server();
  }

  configure() {
    var server = this.server;

    server.connection({ port: process.env.PORT  });

    server.route({
      method: 'GET',
      path: '/',
      handler: ClientService.all
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: ClientService.save
    });

    server.route({
      method: 'PUT',
      path: '/',
      handler: ClientService.update
    });

    server.route({
      method: 'DELETE',
      path: '/',
      handler: ClientService.remove
    });

    server.route({
      method: 'GET',
      path: '/health',
      handler: ClientService.health
    });

    return this;
  }

  start() {
    var server = this.server;

    server.start(err => {
      if (err) throw err;

      console.log(server.info);
      console.log(`Server running at: ${server.info.uri}`);

      this.register();
    });
  }

  register() {
    var server = this.server;

    var options = {
      name: server.info.host,
      address: server.info.host,
      check: {
        http: `${server.info.uri}/health`,
        interval: '10s'
      }
    };

    consul.agent.service.register(options, err => {
      if (err) throw err;

      process.on('SIGINT', function() {
        consul.agent.service.deregister(server.info.host, function(err, result) {
          if (err) throw err;
          console.log("Service unregistered from service discovery.");
        });
      });
    });
  }

  static health(request, reply) {
    reply({ status: 'healthy' });
  }

  static all(request, reply) {
    Client
    .run()
    .then(clients => reply(clients))
    .error(error => reply(error));
  }

  static save(request, reply) {
    new Client(request.payload)
        .save()
        .then(client => reply(client))
        .error(error => reply(error));
  }

  static update(request, reply) {
    Client
    .get(request.payload.id)
    .update(request.payload)
    .then(client => reply(client))
    .error(error => reply(error));
  }

  static remove(request, reply) {
    Client
    .get(request.payload.id)
    .then(client => {
      client
      .delete()
      .then(result => reply(result))
      .error(error => reply(error));
    })
    .error(error => reply(error));
  }
}

new ClientService()
    .configure()
    .start();
