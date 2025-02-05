const http = require("node:http");

const { parseJSON } = require("./util");

class Rush {
  constructor() {
    this.server = http.createServer(); // Create a HTTP server instance
    this.routes = {}; // Store routes in an object (method + URL as keys)
    this.middleWare = []; // Array to store middleware function
    this.handleErr; // Store custom error handler function

    this.server.on("request", (req, res) => {
      // Handling incoming HTTP requests

      // Custom response helpers for setting status and sending JSON responses
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };

      // Extract URL path and query parameters
      const makeUrlWithoutParams = req.url.split("?")[0];
      req.params = new URLSearchParams(req.url.split("?")[1]);

      // Function to process middleware in sequence
      const runMiddleWare = (req, res, middleWare, index) => {
        if (index === middleWare.length) {
          // If all middleware is processed

          if (!this.routes[req.method.toLowerCase() + makeUrlWithoutParams]) {
            // If no matching route key is found
            return res
              .status(404)
              .json({ error: `Cannot ${req.method} ${urlWithoutParams}` });
          }

          // Execute the route handler with error handling
          this.routes[req.method.toLowerCase() + makeUrlWithoutParams](
            req,
            res,
            (error) => {
              res.setHeader("Connection", "close");
              this.handleErr(req, res, error);
            }
          );
        } else {
          // Call the next middleware in the chain
          middleWare[index](req, res, () => {
            runMiddleWare(req, res, middleWare, index + 1);
          });
        }
      };

      runMiddleWare(req, res, this.middleWare, 0); // Start processing middleware
    });
  }

  /**
   * Registers a new route.
   * @param {string} method - HTTP method (e.g., "get", "post").
   * @param {string} url - Route URL.
   * @param {function} callback - Route handler function (req, res, error).
   */
  route(method, url, callback) {
    this.routes[method + url] = callback;
  }

  /**
   * Adds middleware to be executed before the route handler.
   * @param {function} callback - Middleware function (req, res, next).
   */
  use(callback) {
    this.middleWare.push(callback);
  }

  /**
   * Sets a global error handler for handling request errors.
   * @param {function} callback - Error handling function (req, res, error).
   */
  handleError(callback) {
    this.handleErr = callback;
  }

  /**
   * Starts the server on the specified port.
   * @param {number} port - Port number to listen on.
   * @param {function} callback - Function executed once the server starts.
   */
  listen(port, callback) {
    this.server.listen(port, () => {
      callback();
    });
  }
}

Rush.parseJSON = parseJSON; // Built-in middleware for parsing JSON request bodies

module.exports = Rush;
