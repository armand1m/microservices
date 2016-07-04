'use strict';

const Hapi = require('hapi');
const ConsulAgentService = require('./consul').agent.service;
const Service = require('./service');

module.exports = class Server {
  constructor() {
    this.server = new Hapi.Server();
    this.prefixes = process.env.PREFIXES.split(",");
    this.name = process.env.SERVICE_NAME;
    this.port = +process.env.SERVICE_PORT;
    this.url = this.prefixes[0];
  }

  get description() {
    var server = this.server;

    return {
      name: `${this.name}:${server.info.id}`,
      address: server.info.host,
      port: this.port,
      tags: this.prefixes.map(prefix => `urlprefix-${prefix}`),
      check: {
        http: `${server.info.uri}/health`,
        interval: '10s'
      }
    };
  }

  configure() {
    var server = this.server;

    server.connection({
      port: this.port,
      routes: {
        cors: true
      }
    });

    server.on('route', this.onRouteAdd);

    server.route({
      method: 'GET',
      path: `${this.url}/host`,
      handler(request, reply) { reply({ host: server.info.host }) }
    });

    Service
    .getRoutes(this.url)
    .forEach(route => server.route(route));

    return this;
  }

  onRouteAdd(route) {
    console.log(`+ ${route.method} ${route.path}`);
  }

  start() {
    return new Promise((resolve, reject) => this.server.start(err => err ? reject(err) : resolve(this)));
  }

  register() {
    return ConsulAgentService.register(this.description);
  }

  unregister() {
    return ConsulAgentService.deregister(this.description.name);
  }
}
