module.exports = require('consul')({
  host: process.env.CONSUL_HOST,
  port: process.env.CONSUL_PORT,
  promisify: true
});
