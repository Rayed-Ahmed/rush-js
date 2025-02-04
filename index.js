const http = require("node:http");

const { parseJSON } = require("./util");

class Rush {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.middleWare = [];
    this.handleErr;

    this.server.on("request", (req, res) => {
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      const makeUrlWithoutParams = req.url.split("?")[0];
      req.params = new URLSearchParams(req.url.split("?")[1]);

      const runMiddleWare = (req, res, middleWare, index) => {
        if (index === middleWare.length) {
          if (!this.routes[req.method.toLowerCase() + makeUrlWithoutParams]) {
            return res
              .status(404)
              .json({ error: `Cannot ${req.method} ${urlWithoutParams}` });
          }

          this.routes[req.method.toLowerCase() + makeUrlWithoutParams](
            req,
            res,
            (error) => {
              res.setHeader("Connection", "close");
              this.handleErr(req, res, error);
            }
          );
        } else {
          middleWare[index](req, res, () => {
            runMiddleWare(req, res, middleWare, index + 1);
          });
        }
      };

      runMiddleWare(req, res, this.middleWare, 0);
      //--------
    });
  }

  route(method, url, callback) {
    this.routes[method + url] = callback;
  }

  use(callback) {
    this.middleWare.push(callback);
  }

  handleError(callback) {
    this.handleErr = callback;
  }

  listen(port, callback) {
    this.server.listen(port, () => {
      callback();
    });
  }
}

Rush.parseJSON = parseJSON;

module.exports = Rush;
