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

A service is a project in a repository that has a `docker-compose.yml` file.

This project must `git submodule` the `armand1m/core-services` project in order to reproduce the environment in the local machine of the developer while developing.
You can `git submodule` other services to help development too.

Every service has its own Docker image, the Dockerfile's must be designed to cache as much as possible its own layers, so it can rebuild images faster and keep a fast cycle of continuous deployment.

Each service runs only one process inside a container.

If a service process throws an error to the STDOUT, the container must restart. After some tries, if the service can't stop throwing errors and operate normally, the environment must understand that the service is down and it's better wait for manual repair, and stop trying to restart the container.
 After some 

## How it is structured

// TODO

## Starting the project

```bash
# init the project
$ ./commands/init

# build the services images
$ ./commands/build

# run the environment
$ ./commands/run
```

You can see the registered routes and services in `http://localhost:9998/`.

The gateway spins up a server in `http://localhost:9999/` that load balance requests to the service instances registered on Consul.

You can access the Consul UI in `http://localhost:8500/` and check the registered services status.

## Monitoring & Logging

- See all containers output:

```bash
$ ./commands/logs
```

- See containers status:

```bash
$ ./commands/status
```

- See the output of all the instances of a service:

```bash
$ ./commands/logs <service-name>
```

## Destroying

You can destroy the containers using:

```bash
$ ./commands/destroy
```

## Scaling

You can scale a service using:

```bash
$ ./commands/scale <service-name>=<number-of-instances>
```
