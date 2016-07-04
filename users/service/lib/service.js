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

  static health(request, reply) { reply({ status: 'healthy' }); }

  static all(request, reply) { reply(User.run()); }

  static save(request, reply) { reply(new User(request.payload).save()); }

  static update(request, reply) { reply(User.get(request.payload.id).update(request.payload)); }

  static remove(request, reply) {
    User
    .get(request.payload.id)
    .then(user => reply(user.delete()))
    .error(error => reply(error));
  }
}

module.exports = Service;
