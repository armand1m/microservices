'use strict';

const Hapi = require('hapi');
const User = require('./model');
const consul = require('./consul');

class UserService {
  constructor() {
    this.server = new Hapi.Server();
  }

  configure() {
    var server = this.server;

    server.connection({ port: process.env.PORT  });

    server.route({
      method: 'GET',
      path: '/',
      handler: UserService.all
    });

    server.route({
      method: 'POST',
      path: '/',
      handler: UserService.save
    });

    server.route({
      method: 'PUT',
      path: '/',
      handler: UserService.update
    });

    server.route({
      method: 'DELETE',
      path: '/',
      handler: UserService.remove
    });

    server.route({
      method: 'GET',
      path: '/health',
      handler: UserService.health
    });

    return this;
  }

  start() {
    var server = this.server;

    server.start(err => {
      if (err) throw err;

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

      process.on('beforeExit', () => {
        consul.agent.service.deregister(function(err, result) {
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
    User
    .run()
    .then(users => reply(users))
    .error(error => reply(error));
  }

  static save(request, reply) {
    new User(request.payload)
        .save()
        .then(user => reply(user))
        .error(error => reply(error));
  }

  static update(request, reply) {
    User
    .get(request.payload.id)
    .update(request.payload)
    .then(user => reply(user))
    .error(error => reply(error));
  }

  static remove(request, reply) {
    User
    .get(request.payload.id)
    .then(user => {
      user
      .delete()
      .then(result => reply(result))
      .error(error => reply(error));
    })
    .error(error => reply(error));
  }
}

new UserService()
    .configure()
    .start();
