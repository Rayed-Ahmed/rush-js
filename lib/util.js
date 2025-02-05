exports.parseJSON = (req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let body = "";

    // Collect incoming data chunks
    req.on("data", (chunk) => {
      body += chunk.toString("utf-8");
    });

    // When data transmission is complete
    req.on("end", () => {
      body = JSON.parse(body); // Attempt to parse JSON
      req.body = body; // Attach parsed data to req.body
      return next(); // Move to next middleware
    });
  } else {
    next();
  }
};
