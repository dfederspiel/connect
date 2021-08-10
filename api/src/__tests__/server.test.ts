import ApiServer from '../server';

describe('the api server', () => {
  it('runs', (done) => {
    const server = new ApiServer();
    server.start((message) => {
      expect(message).toEqual('Server started at: http://localhost:3000');
      server.handle?.close(() => {
        done();
      });
    });
  });
});
