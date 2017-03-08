# A Microservices Architecture Study

I've been reading and studying about microservices in the last months, and finally got a chance to start an actual implementation.

_Simple gif showing how to setup project, run, and scale it:_

![Microservices Demo Gif](assets/microservices-demo.gif)

## Whats this and its goal

This is somehow an environment to run and scale web services.

To know about its goals, read: https://github.com/armand1m/microservices/wiki/Goal

## How it is structured

This project actually is only a project that has a `docker-compose.yml` file with some services defined, that are also `git submodules`.

These services connect to a consul instance in order to be found by the [`ebay/fabio`](https://github.com/ebay/fabio) instance, so it can load balance and be used as an API Gateway for them.

## What is a service

Essentially, a service is just a RESTful API that can register and deregister itselfs from a Service Discovery instance.

To know more, read: https://github.com/armand1m/microservices/wiki/What-is-a-Service

## Starting the project

Make sure you have Docker Daemon running.
Make sure you have Git and Docker Compose installed.

```bash
# initialize the project and its submodules
$ ./install.sh

# build the services images
$ ./commands/build

# run the environment
$ ./commands/run
```

Some useful urls:

 - Gateway Entrypoint: `http://localhost:9999/`
 - Gateway Route Table: `http://localhost:9998/`
 - Service Discovery Monitoring Panel: `http://localhost:8500/`
 
## Other commands

Refer to [armand1m/microservice-compose-utils](https://github.com/armand1m/microservices-compose-utils/) README.md to know more.

You can use `docker-compose` commands normally as well, the project above has only some really simple `bash` files to speed up common tasks.
