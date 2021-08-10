import ApiServer from '../server';

describe('the api server', () => {
  it('runs', (done) => {
    const server = new ApiServer();
    const instance = server.start((message) => {
      expect(instance).toBeDefined();
      server.handle?.close(() => {
        expect(message).toEqual('Server started at: http://localhost:3000');
        done();
      });
    });
  });
});
