import { createProxyMiddleware } from 'http-proxy-middleware';

/**
 * Used in conjunction with "proxy" setting in package.json to forward ALL requests
 * to /graphql when hosting static build assets.
 *
 * When using react static assets, we still want forward any unresolved requests to
 * the root "/" so that React Router will work as we intend and not just 404. This is a default
 * behavior when running the app in dev mode, but we must configure it ourselves
 * when serving with the production Express server that contains our back end.
 *
 * We can use the "proxy" setting to get us part of the way there, but that setting
 * will only forward unresolved requests if the Content-type is html/text, which happens
 * to be the default request type when navigating in a browser. Consequently,
 * adding the proxy setting alone still blocks access to /graphql.
 *
 * To more explicitly proxy requests, we can define them here.
 *
 * NOTE: ws:true is needed for subscriptions to work as they use websockets, not http
 *
 */
export default function (app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'http://graphql:4000',
      changeOrigin: true,
      ws: true,
    }),
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://api:3000',
      changeOrigin: true,
    }),
  );
}
