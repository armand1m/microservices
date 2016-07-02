# A Microservices Architecture Study

I've been reading and studying about microservices in the last months, and finally got a chance to do an actual implementation.

## What I'm looking for

A polyglot, scalable, portable, and easy to maintain distributed architecture.

<!-- By "polyglot", I mean:

 - Any service can be built using any programming language it finds more suitable for the job.

 - Any service can use any kind of database it finds more suitable for the job.

By "easy to maintain", I mean:

 - A service must be simple, and small. We're talking about microservices, there are some teams that keep microservices so small that they keep between 1 ~ 100 LOC to get the job done.

 - Must be easy to write tests for each service.

 - It needs to be easy to switch from a stack to another, so must be upgrading to major versions of frameworks and runtimes. -->

## So what am I trying to do:

I'm creating services and exposing them through a RESTful HTTP API.

Every service has its own Docker image, the Dockerfile's must be designed to cache as much as possible the dependencies of the services, so it can rebuild images faster and keep a good cycle of continuous deployment.

Each service instance registers itself to a Service Discovery, so the gateway and the services themselves can find others services instances across the network.

When the service terminates, it must deregister itself from the Service Discovery, or throw any errors if needed.

If a service throws an error to the STDOUT, the containers must restart by itself. After some tries, if the service can't instantiate and operate normally, the environment must understand that the service is buggy and it's better wait for manual repair, and stop trying to restart the container.

## How it is structured

Actually (01/07/2016) it has only 4 services:

- Clients service (Node.js + RethinkDB)
- Users service (Node.js + RethinkDB)
- Consul (Hashicorp Service Discovery)
- Fabio (eBay's API Gateway)

## Starting the project

You can start the whole system in production environment using:

```bash
$ ./build #build production images
$ ./run #run all services
```

You can start the whole system in development environment using `docker-compose up` from this project root.

You can also start single services in development environment accessing their directories and running `docker-compose up` in their root folder.

The gateway spins up a server in `http://localhost:9999` that load balance requests to the other services.

## Monitoring & Logging

```bash
$ ./logs # logs real time events to stdout
```

You can also log using `docker-compose logs -f`.

You can see the registered routes and services in `http://localhost:9998/routes`.

You can also access Consul UI in `http://localhost:8500`.

## Destroying

You can destroy the instantiated containers in production environment using:

```bash
$ ./destroy
```
