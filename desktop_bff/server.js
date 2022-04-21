const dotenv = require("dotenv").config();
const express = require("express");
const https = require("https");
const morgan = require("morgan");
//const fetch = require("node-fetch");
const { createProxyMiddleware } = require("http-proxy-middleware");
const HOST = "desktop_bff";
const PORT = process.env.PORT || 4001;
const TARGET = process.env.TARGET || "http://proxy2:6001";
const log = require("./logstash.js");

const app = express();
app.use(morgan("dev"));

const Logger = function (req, res, next) {
  log("info", "request-incoming", {
    path: req.url,
    method: req.method,
    ip: req.ip,
    ua: req.headers["user-agent"] || null,
  });
  next();
};

app.use(Logger);

app.use(
  "/desktop",
  createProxyMiddleware({
    target: TARGET,
    changeOrigin: true,
    pathRewrite: { "^/desktop": "" },
  })
);

app.use(express.json());

app.get("/info", async (req, res, next) => {
  return res.send("proxy working");
});

app.listen(PORT, () => {
  log("verbose", "listen", { host: HOST, port: PORT });
  console.log(`Proxy running at http://${HOST}:${PORT}/`);
});
