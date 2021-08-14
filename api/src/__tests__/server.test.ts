import ApiServer from '../server';
import 'cross-fetch/polyfill';

describe('the api server', () => {
  let server;
  beforeAll((done) => {
    server = new ApiServer();
    server.start((message) => {
      expect(message).toEqual('Server started at: http://localhost:3000');
      done();
    });
  });

  afterAll((done) => {
    server.handle?.close(() => {
      done();
    });
  });

  it('pongs when pinged', async () => {
    const result = await fetch('http://localhost:3000/api/ping').then((res) =>
      res.json(),
    );
    expect(result).toEqual({
      message: 'pong!',
    });
  });
});
