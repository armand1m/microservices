# A Microservices Architecture Study

I've been reading and studying about microservices in the last months, and finally got a chance to start an actual implementation.

## What I'm looking for

A suite of polyglot, scalable, portable, and easy to maintain microservices running in an appropriate environment.

By "polyglot", I mean:

 - Any service can be built using any kind of programming language and libraries it finds more suitable for getting his job done.

 - Any service can use any kind of database it finds more suitable for the job.

By "easy to maintain", I mean:

 - A service must be DRY, simple, small and follow the SRP from SOLID principles.

 - Must be easy to write unit and e2e tests for each service.

 - Must be easy to switch from a stack to another, so must be upgrading to major versions of frameworks and runtimes.

 - It can't take longer than 3 days to refactor the whole service.

By "portable", I mean:

 - Must be easy to run all the infrastructure needed to run one or more services in any kind of environment.

 - Must be easy to develop, build, debug and run a service independently 
 or with one or more dependent services.

## So what I am doing:

Basically: I'm creating services and exposing them through a RESTful HTTP API.

But in a distributed architecture it has some challenges in order to achieve consistency and resiliency.

Every service has its own Docker image, the Dockerfile's must be designed to cache as much as possible its own layers, so it can rebuild images faster and keep a fast cycle of continuous deployment.

Each service runs only one process inside a container.

If a service process throws an error to the STDOUT, the container must restart. After some tries, if the service can't stop throwing errors and operate normally, the environment must understand that the service is down and it's better wait for manual repair, and stop trying to restart the container.
 After some 

## How it is structured

// TODO

## Starting the project

First initialize git submodules. Each microservice is a git repository in my account and is used here by a git module.

```bash
$ git submodule init
$ git submodule update
```

Then build the services images:

```bash
$ sudo ./commands/build
```

Then you can start the whole system using:

```bash
$ sudo ./commands/run
```

You can see the registered routes and services in `http://localhost:9998/`.

The gateway spins up a server in `http://localhost:9999/` that load balance requests to the service instances registered on Consul.

You can access the Consul UI in `http://localhost:8500/` and check the registered services status.

## Monitoring & Logging

- See all containers output:

```bash
$ sudo ./commands/logs
```

- See containers status:

```bash
$ sudo ./commands/status
```

- See the output of all the instances of a service:

```bash
$ sudo docker-compose logs <service-name>
```

## Destroying

You can destroy the containers using:

```bash
$ sudo ./commands/destroy
```

## Scaling

You can scale a service using:

```bash
$ sudo docker-compose scale <service-name>=<number-of-instances>
```
