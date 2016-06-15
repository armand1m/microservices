'use strict';

const Client = require('./model');

class Service {
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

module.exports = Service;
