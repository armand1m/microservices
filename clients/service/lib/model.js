'use strict';

const Database = require('./database');
const type = require('thinky').type;

const Model = Database.createModel("Client", {
  id: type.string(),
  name: type.string().required(),
  email: type.string().email().required(),
  birthday: type.date(),
  active: type.boolean().default(true)
});

module.exports = Model;
