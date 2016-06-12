const environment = process.env.NODE_ENV || 'development';
const configFile = process.env.DOCKER_ENV ? '/config.docker.json' : '/config.json';
const config = require(`${__dirname}/${configFile}`)[environment];

const thinky = require('thinky');
const type = thinky.type;

const db = thinky({
  db: "users",
  host: process.env.DB_HOST ? process.env.DB_HOST : config.host,
  port: process.env.DB_PORT ? process.env.DB_PORT : config.port
});

const User = db.createModel("User", {
  id: type.string(),
  email: type.string().required(),
  password: type.string().required(),
  active: type.boolean().default(true)
});

module.exports = User;
