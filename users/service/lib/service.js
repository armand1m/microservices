'use strict';

const User = require('./model');

class Service {
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
