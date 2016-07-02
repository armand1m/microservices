'use strict';

const Database = require('./database');
const type = require('thinky').type;

const Model = Database.createModel("User", {
  id: type.string(),
  email: type.string().required(),
  password: type.string().required(),
  active: type.boolean().default(true)
});

module.exports = Model;
