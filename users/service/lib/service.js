'use strict';

const User = require('./model');

class Service {
  static getRoutes(path) {
    return [
      { method: 'GET', path: path, handler: Service.all },
      { method: 'POST', path: path, handler: Service.save },
      { method: 'PUT', path: path, handler: Service.update },
      { method: 'DELETE', path: path, handler: Service.remove },
      { method: 'GET', path: '/health', handler: Service.health }
    ];
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

module.exports = Service;
