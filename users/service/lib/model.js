const config = require('../config/config');
const thinky = require('thinky');
const type = thinky.type;

const db = thinky({
  db: process.env.SERVICE_NAME,
  host: process.env.DB_HOST ? process.env.DB_HOST : config.DB_HOST,
  port: process.env.DB_PORT ? process.env.DB_PORT : config.DB_PORT
});

const User = db.createModel("User", {
  id: type.string(),
  email: type.string().required(),
  password: type.string().required(),
  active: type.boolean().default(true)
});

module.exports = User;
