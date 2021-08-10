import dotenv from 'dotenv';
import { createServer, Server } from 'http';
import axios from 'axios';
import express from 'express';
import history from 'connect-history-api-fallback';

import { UserContext } from './middleware/UserContext';

const port = process.env.PORT || 3000;

export default class ApiServer {
  // client: redis.RedisClient;
  app: express.Application;
  handle?: Server;

  constructor() {
    axios.defaults.baseURL = process.env.API_BASE_URL || '';
    dotenv.config();

    // this.client = redis.createClient({
    //   port: 6379, // replace with your port
    //   host: 'redis', // replace with your hostname or IP address
    // });

    // Create an express application
    this.app = express();

    // Example: If you're using a body parser, always put it after the event adapter in the middleware stack

    this.app.use(express.json()); // for parsing application/json
    this.app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    this.app.get('/api/ping', (_, res) => {
      // this.client.publish('AFFIRMATION_GIVEN', '{"from":1,"to":"1"}');
      res.send({
        message: 'pong!',
      });
    });

    const router = express.Router();
    this.app.use('/api', UserContext, router);

    this.app.use(
      history({
        logger: console.log.bind(console),
      }),
    );
  }

  start(cb: (message: string) => void): Server {
    this.handle = createServer(this.app);
    return this.handle.listen(port, () => {
      cb(`Server started at: http://localhost:${port}`);
    });
  }
}
