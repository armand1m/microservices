const config = require('./config/config');

const consul = require('consul')({
  host: process.env.CONSUL_HOST ? process.env.CONSUL_HOST : config.CONSUL_HOST,
  port: process.env.CONSUL_PORT ? process.env.CONSUL_PORT : config.CONSUL_PORT,
  promisify: true
});

module.exports = consul;
