# Connect
![build status](https://github.com/dfederspiel/connect/actions/workflows/main.yml/badge.svg)

Connect is a dev environment that focuses on developer experience. It is a Docker friendly, enterprise-grade, starting point for anyone wanting to use React and GraphQL in their projects.

Next in the generation of starter kits, Connect doesn't try to obfuscate any functionality from the developer, and it can be changed to suit your needs.

## Getting Started 
### Prerequisites
[Docker Desktop](https://www.docker.com/products/docker-desktop) is needed to build containers and use docker-compose.

#### Install Dependencies
```
npm install
npm setup
```
#### Build the dev environment
```
docker compose build
```
#### Start the environment
```
docker compose up
```

#### Initialize the Database
```
npx prisma migrate dev
```

---

## What Next?  
That's it, you can start changing files. To be sure all is well, though, you can check on a few things:

### Check List  
1. Docker Desktop will show `RUNNING` services: (`www, graphql, redis, and  postgres`)
2. The site will be accessible via `http://localhost`
3. GraphQL is accessible at `http://localhost:8080/graphql`ping`
4. pgAdmin will connect on `http://localhost:8088`, but you can also use `npx prisma studio` if you want a lightweight option.

## Core Technologies
* React - Main UI  
    * Material UI
* Apollo GraphQL - Talks to Postgres via Prisma
    * Server and Client
* Websockets
    * For GraphQL subscriptions via Redis.
* Redis - Pub/Sub
* Postgres - DB
    * Automatically generated based on Prisma schema
* Prisma ORM - DB and Code generation

# Context
[Apollo with Auth Context](www/src/context/ApolloAuthContext/README.md)  
