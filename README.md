# Connect
![build status](https://github.com/dfederspiel/connect/actions/workflows/main.yml/badge.svg)

Connect is a dev environment that focuses on developer experience. It is a Docker friendly, enterprise-grade, starting point for anyone wanting to use React and GraphQL in their projects. It is an opinionated codebase, and a successor to my also opinionated [Rapid Dev](https://github.com/dfederspiel/rapid-dev) static site generator.

Next in the generation of starter kits, Connect doesn't try to obfuscate any functionality from the developer, and it can be changed to suit your needs. The hope being that it will save you hours of aggravation when pouring foundations for your project, and clear the path for your creativity instead of squelching it because some tools aren't behaving as advertised.

Can you use [Next.js](https://nextjs.org/) or [Create React App](https://reactjs.org/docs/create-a-new-react-app.html)? Sure, absolutely, those and the like are grand, and they do quite a lot for us. However, in my experience, there is **always** that occasion when we hit the limits of these systems and, often late in the project, we spend inordinate amounts of time undoing things in favor of something we have greater control over.

## Getting Started 
### Prerequisites
[Docker Desktop](https://www.docker.com/products/docker-desktop) is needed to build containers and use docker-compose.

#### Install Dependencies
```
yarn install
yarn setup
```
#### Build the dev environment
```
docker-compose build
```
#### Start the environment
```
docker-compose up
```

---

## What Next?  
That's it, you can start changing files. To be sure all is well, though, you can check on a few things:

### Check List  
1. Docker Desktop will show five `RUNNING` services: (`www, graphql, api, redis, and  postgres`)
2. The site will be accessible via `http://localhost`
3. GraphQL is accessible at `http://localhost:8080/graphql`
4. API can be tested by accessing `http://localhost:8081/ping`
5. pgAdmin will connect on `http://localhost:5432`

## Core Technologies
* React - Main UI  
    * Material UI
* Apollo GraphQL - Talks to Postgres via Prisma
    * Server and Client
* Websockets
    * For GraphQL subscriptions via Redis.
* Api - Standard REST API for non-GraphQL endpoints.
* Redis - Pub/Sub
* Postgres - DB
    * Automatically generated based on Prisma schema
* Prisma ORM - DB and Code generation

# Context
[Apollo with Auth Context](www/src/context/ApolloAuthContext/README.md)  
