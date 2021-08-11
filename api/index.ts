import ApiServer from './src/server';
import { test } from '@lib/index';
console.log(test('API'));

const server = new ApiServer();
server.start((message) => {
  console.log(message);
});
