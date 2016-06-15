'use strict';

const Hapi = require('hapi');
const Consul = require('./consul');
const Service = require('./service');

class Server {
  constructor() {
    this.server = new Hapi.Server();
    this.prefixes = process.env.PREFIXES.split(",");
    this.name = process.env.SERVICE_NAME;
    this.url = this.prefixes[0];
  }

  configure() {
    var server = this.server;

    server.connection({ port: process.env.PORT  });

    server.route({
      method: 'GET',
      path: this.url,
      handler: Service.all
    });

    server.route({
      method: 'POST',
      path: this.url,
      handler: Service.save
    });

    server.route({
      method: 'PUT',
      path: this.url,
      handler: Service.update
    });

    server.route({
      method: 'DELETE',
      path: this.url,
      handler: Service.remove
    });

    server.route({
      method: 'GET',
      path: `${this.url}/host`,
      handler(request, reply) {
        reply({ host: server.info.host })
      }
    });

    server.route({
      method: 'GET',
      path: '/health',
      handler(request, reply) {
        reply({ status: 'healthy' });
      }
    });

    return this;
  }

  start() {
    var server = this.server;

    server.start(err => {
      if (err) throw err;

      console.log(`Server running at: ${server.info.uri}`);
      console.log("Server info: ", server.info);

      this.register();
    });
  }

  register() {
    var server = this.server;

    var options = {
      name: `${this.name}:${server.info.id}`,
      address: server.info.host,
      port: +process.env.PORT,
      tags: process.env.PREFIXES.split(",").map(prefix => `urlprefix-${prefix}`),
      check: {
        http: `${server.info.uri}/health`,
        interval: '10s'
      }
    };

    Consul.agent.service.register(options, err => {
      if (err) throw err;

      process.on('SIGINT', () => {
        Consul.agent.service.deregister(server.info.id, function(err, result) {
          if (err) throw err;
          console.log("Service unregistered from service discovery.");
        });
      });
    });
  }
}

new Server().configure().start();
