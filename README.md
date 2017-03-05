# A Microservices Architecture Study

I've been reading and studying about microservices in the last months, and finally got a chance to start an actual implementation.

## What I'm looking for

A suite of polyglot, scalable, portable, and easy to maintain microservices running in an appropriate and reproducible environment.

By "polyglot", I mean:

 - [x] Any service can be built using any kind of programming language and libraries it finds more suitable for getting his job done.

 - [x] Any service can use any kind of database it finds more suitable for the job.

By "easy to maintain", I mean:

 - [ ] A service must be DRY, simple, small and follow the SRP from SOLID principles.

 - [ ] Must be easy to write unit and e2e tests for each service.

 - [ ] Must be easy to switch from a stack to another, so must be upgrading to major versions of frameworks and runtimes.

 - [ ] It can't take longer than 3 days to refactor the whole service.

By "portable", I mean:

 - [x] Must be easy to run all the infrastructure needed to run one or more services in any kind of environment.

 - [ ] Must be easy to develop, build, debug and run a service independently or with one or more dependent services.

 - [ ] Must be able to reproduce the state of one or more services for debugging purposes.

## So what I am doing

This is an environment for running stateless services and their dependencies, but in order to achieve that, your service must follow some rules.

**First**: your service must be stateless. This environment will not preserve any state of any of your services, so if you need it, you probably should think about 

**Second**: your service must register to a Consul service registry when it has successfully started. It is needed in order to scale your service in multiple instances using `./commands/scale`. The `armand1m/core-services` is a project that has a `docker-compose.yml` file with already defined ports and environment variables for some basic services for this environment like Consul and Fabio.

**Third**: your service must know how to handle its process health. If it needs to exit unexpectedly, it must know how to handle it, deregister from the service registry, then throw SIGTERM and some error code to finish the process ungracefully.

# What is a service

Essentially, a service is just a RESTful API that can register and deregister itselfs from a Service Discovery instance.

To know more, read: https://github.com/armand1m/microservices-compose-utils/wiki/What-is-a-Service

## How it is structured

This project actually is only a project that has a `docker-compose.yml` file, and has 3 services as `git submodules`.

It also has a Docker Compose set of bash utilities as a `git submodule` as well.

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
