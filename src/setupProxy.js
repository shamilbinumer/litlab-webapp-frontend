// src/setupProxy.js
import  { createProxyMiddleware } from "http-proxy-middleware";

export default  function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://2620:0:890::100',
      changeOrigin: true,
    })
  );
}