// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');

window.crypto = {
  getRandomValues: (buffer) => crypto.randomFillSync(buffer),
};
