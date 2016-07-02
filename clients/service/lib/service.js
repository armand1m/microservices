'use strict';

const Client = require('./model');

module.exports = class Service {
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
