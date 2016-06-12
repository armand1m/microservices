'use strict';

const environment = process.env.NODE_ENV || 'development';
const configFile = process.env.DOCKER_ENV ? '/config.docker.json' : '/config.json';
const config = require(`${__dirname}/${configFile}`)[environment];

const Hapi = require('hapi');
const thinky = require('thinky');
const type = thinky.type;

const db = thinky({
  db: "clients",
  host: process.env.DB_HOST ? process.env.DB_HOST : config.host,
  port: process.env.DB_PORT ? process.env.DB_PORT : config.port
});

const Client = db.createModel("Client", {
  id: type.string(),
  name: type.string().required(),
  email: type.string().email().required(),
  birthday: type.date(),
  active: type.boolean().default(true)
});

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
      handler: ClientService.remove,
      config: {
        description: 'Delete a client.',
        notes: 'Send the id of the client as json. E.g.: "{ "id": "hash" }". ',
        tags: ['api', 'client']
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
