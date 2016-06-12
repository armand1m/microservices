const environment = process.env.NODE_ENV || 'development';
const configFile = process.env.DOCKER_ENV ? '/config.docker.json' : '/config.json';
const config = require(`${__dirname}/${configFile}`)[environment];

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

module.exports = Client;
