const config = require('./config/config');
const thinky = require('thinky');
const type = thinky.type;

const db = thinky({
  db: "clients",
  host: process.env.DB_HOST ? process.env.DB_HOST : config.DB_HOST,
  port: process.env.DB_PORT ? process.env.DB_PORT : config.DB_PORT
});

const Client = db.createModel("Client", {
  id: type.string(),
  name: type.string().required(),
  email: type.string().email().required(),
  birthday: type.date(),
  active: type.boolean().default(true)
});

module.exports = Client;
