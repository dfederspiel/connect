import { createServer } from 'http';
import GraphQLServer from '../server';
import { PubSub } from 'graphql-subscriptions';
import express from 'express';
import { exec } from 'child_process';
const pubsub = new PubSub();

describe('the graphql server', () => {
  it('exists', () => {
    const server = new GraphQLServer(pubsub, {});
    expect(server).toBeDefined();
  });

  it('can create a server instance', (done) => {
    const app = express();
    const apollo = new GraphQLServer(pubsub, false);
    const instance = apollo.server();
    instance.applyMiddleware({ app });
    const httpServer = createServer(app);
    instance.installSubscriptionHandlers(httpServer);
    const server = app.listen(8080, async () => {
      exec('echo "The \\$HOME variable is $HOME"', (error, stdout, stderr) => {
        console.log('Server started...closing...', stdout, stderr, error);
        server.close();
        done();
      });
    });
  });
});
