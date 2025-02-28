# rushxx

**rushxx** is a lightweight, minimalistic Node.js framework for handling HTTP requests with middleware support. It provides a simple API for defining routes, using middleware, and handling errors.

## Features

- Minimal and lightweight HTTP framework

- Middleware support

- Custom error handling

- JSON response handling

## Installation

Clone this repository and include rushxx in your project:[https://github.com/Rayed-Ahmed/rushxx], or

```sh
npm install rushxx // Install rushxx with npm
```

## Usage

### Creating a Server

```sh
const Rush = require("rushxx");
const app = new Rush();

app.listen(3000, () => {
console.log("Server running on port 3000");
});
```

### Defining Routes

```sh
app.route("get", "/", (req, res) => {
res.json({ message: "Hello, world!" });
});
```

### Using Middleware

```sh
app.use((req, res, next) => {
console.log(`Incoming request: ${req.method} ${req.url}`);
next();
});
```

### Handling Errors

```sh
app.handleError((req, res, error) => {
res.status(500).json({ error: error.message || "Internal Server Error" });
});
```

## API

### `app.route(method, url, callback)`

Registers a route with the given HTTP method and URL.

- **method** _(string)_ - HTTP method (e.g., "get", "post")

- **url** _(string)_ - Route URL

- **callback** _(function)_ - Function with (req, res, next) parameters

### `app.use(callback)`

Adds a middleware function to be executed before the request reaches the route handler.

- **callback** _(function)_ - Function with (req, res, next) parameters

### `app.handleError(callback)`

Sets a global error handler for requests.

- **callback** (function) - Function with (req, res, error) parameters

### `app.listen(port, callback)`

Starts the server on the specified port.

- **port** _(number)_ - Port number to listen on

- **callback** _(function)_ - Function executed once the server starts

## Contributing

Feel free to fork this repository [https://github.com/Rayed-Ahmed/rushxx] and contribute! Pull requests are welcome.
