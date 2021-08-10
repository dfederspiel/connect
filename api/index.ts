import ApiServer from './src/server';

const server = new ApiServer();
server.start((message) => {
  console.log(message);
});
