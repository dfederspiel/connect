/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { User } from '@prisma/client';
import AffirmationsResolvers from '../AffirmationsResolvers';
import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();
jest.setTimeout(20000)
// // const { execute } = require('apollo-link');
// // const { WebSocketLink } = require('apollo-link-ws');
// // const { SubscriptionClient } = require('subscriptions-transport-ws');
// // const ws = require('ws');
// const server = new GraphQLServer(pubsub, false);
// const instance = server.server();

// const getWsClient = function(wsUrl) {
//   const client = new SubscriptionClient(
//     wsUrl, {reconnect: true}, ws
//   );
//   return client;
// };

// const createSubscriptionObservable = (wsUrl, query, variables) => {
//   const link = new WebSocketLink(getWsClient(wsUrl));
//   return execute(link, {query: query, variables: variables});
// };

const context = {
  user: {
    id: 1,
    domain: '',
    email: '',
  } as User,
};

// let serverProcess: ChildProcess;
// function sleep( ms ) {
//   return new Promise( ( resolve ) => {
//     setTimeout( resolve, ms )
//   } )
// }


// beforeAll(async () => {
//   console.log(`ROOT DIR: ${__dirname}`)
//   // Then... start the server (& check if running on win)
//   serverProcess = exec('cd graphql && yarn start:production:test', (err, stdout, stderr) => {
//     console.log('GOING....', err, stdout, stderr);
//   })
//   await sleep(10000)
// })

// afterAll((done) => {
//   console.log('FINISHED TESTS, SHUTTING DOWN');
//   serverProcess.on('close', (code, signal) => {
//     console.log(`child process terminated due to receipt of signal ${signal}`);
//     done();
//   });
//   serverProcess.kill('SIGSTOP')
// })

describe('the affirmations resolver', () => {
  it('exists', () => {
    const resolver = new AffirmationsResolvers(pubsub);
    expect(resolver).toBeDefined();
  });

  it('can send affirmations', async () => {
    const resolver = new AffirmationsResolvers(pubsub);
    const result = await resolver.resolvers.Mutation.sendAffirmation(
      null,
      { userId: '1' },
      context,
      null,
    );
    expect(result).toMatchSnapshot();
  });

  it('can cover subscriptions', async () => {
    const resolver = new AffirmationsResolvers(pubsub);
    const fn = await resolver.resolvers.Subscription.affirmationGiven.subscribe();
    await pubsub.publish('AFFIRMATION_GIVEN', {});
    await resolver.resolvers.Mutation.sendAffirmation(
      null,
      { userId: '1' },
      context,
      null,
    )
  });
});
