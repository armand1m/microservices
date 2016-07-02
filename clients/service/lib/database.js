module.exports = require('thinky')({
  db: process.env.SERVICE_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT
});
