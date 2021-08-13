// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

const mockFetchPromise = Promise.resolve({
  ok: true,
  json() {
    return { ok: 'yay' };
  },
});

//global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

window.crypto = {
  getRandomValues: (buffer) => crypto.randomFillSync(buffer),
};
