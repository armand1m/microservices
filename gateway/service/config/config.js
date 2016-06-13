const environment = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/${process.env.DOCKER_ENV ? '/config.docker.json' : '/config.json'}`)[environment];

module.exports = config;
