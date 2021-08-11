import ApiServer from './src/server';
import { test } from '@lib/tools';
console.log(test('API'));

const server = new ApiServer();
server.start((message) => {
  console.log(message);
});
