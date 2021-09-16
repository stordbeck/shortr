const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(
      (pathname, req) =>
        // Proxy all non GETs and anything that is a single-level,
        // bare pathname (e.g. /foo, /create, /Y_Kv-t6v),
        // but not files (e.g. /bundle.js, /foo.css)
        req.method !== "GET" || /^\/[a-zA-Z0-9-_]+$/.test(pathname),
      {
        target: "http://localhost:8080",
        changeOrigin: true,
      }
    )
  );
};
