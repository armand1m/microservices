'use strict';

const Hapi = require('hapi');
const User = require('./model');

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
      handler: UserService.remove,
      config: {
        description: 'Delete a user.',
        notes: 'Send the id of the user as json. E.g.: "{ "id": "hash" }". ',
        tags: ['api', 'user']
      }
    });

    return this;
  }

  start() {
    var server = this.server;

    server.start(err => {
      if (err) throw err;

      console.log(`Server running at: ${server.info.uri}`);
    });
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
