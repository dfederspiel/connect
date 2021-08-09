import dotenv from 'dotenv';
dotenv.config();

import { createServer } from 'http';

import redis from 'redis';
const client = redis.createClient({
  port: 6379, // replace with your port
  host: 'redis', // replace with your hostname or IP address
});

import axios from 'axios';
axios.defaults.baseURL = process.env.API_BASE_URL || '';

import express from 'express';
import history from 'connect-history-api-fallback';

import { UserContext } from './middleware/UserContext';

const port = process.env.PORT || 3000;

// Create an express application
const app = express();

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get('/api/ping', (_, res) => {
  client.publish('AFFIRMATION_GIVEN', '{"from":1,"to":"1"}');
  res.send({
    message: 'pong!',
  });
});

const router = express.Router();
app.use('/api', UserContext, router);

const httpServer = createServer(app);

app.use(
  history({
    logger: console.log.bind(console),
  }),
);

httpServer.listen(port, () => {
  console.log(`Server started at: http://localhost:${port}`);
});
