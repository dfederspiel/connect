import express, { static as staticFiles } from 'express';
import { createServer } from 'http';
import history from 'connect-history-api-fallback';

import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.get('/policy', (req, res) => {
  res.send('<h1>Policy...</h1>');
});
app.get('/terms', (req, res) => {
  res.send('<h1>Terms...</h1>');
});
app.get('/support', (req, res) => {
  res.send('<h1>Support...</h1>');
});
app.get('/documentation', (req, res) => {
  res.send('<h1>Documentation...</h1>');
});

app.use(
  '/api',
  createProxyMiddleware({
    target: 'http://api:3000',
    changeOrigin: true,
    onError: (err) => {
      console.log('API proxy error:', err);
    },
    onProxyReq: (req) => {
      console.log('api request: ', req.path);
    },
  }),
);
app.use(
  '/graphql',
  createProxyMiddleware({
    target: 'http://graphql:4000',
    changeOrigin: true,
    ws: true,
    onError: (err) => {
      console.log('GraphQL proxy error:', err);
    },
    onProxyReq: (req) => {
      console.log('graphql request: ', req.path);
    },
  }),
);
const httpServer = createServer(app);
const httpPort = 80;

app.use(history());
app.use('/', staticFiles('build'));

httpServer.listen(httpPort, () => {
  console.log(`
    Server is running! 🚀
    Listening at http://localhost`);
});
