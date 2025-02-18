const fs = require("node:fs");
const path = require("node:path");

const MIME_TYPES = {
  html: "text/html",
  css: "text/css",
  js: "application/javascript",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain",
  eot: "application/vnd.ms-fontobject",
  otf: "font/otf",
  ttf: "font/ttf",
  woff: "font/woff",
  woff2: "font/woff2",
};

exports.serveStatic = (folderPath, newMimeType) => {
  if (newMimeType) {
    Object.assign(MIME_TYPES, newMimeType);
  }

  function processFolder(folderPath, parentFolder) {
    const staticFiles = [];
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const fullPath = path.join(folderPath, file);

      if (fs.statSync(fullPath).isDirectory()) {
      } else {
        const relativePath = path.relative(parentFolder, fullPath);
        const fileExtention = path.extname(relativePath).slice(1);
        if (MIME_TYPES[fileExtention]) staticFiles.push("/" + relativePath);
      }
    }

    return staticFiles;
  }

  const fileArrayToFilemap = (filesArray) => {
    const filesMap = {};
    for (const file of filesArray) {
      const fileExtension = path.extname(file).slice(1);
      filesMap[file] = {
        path: folderPath + file,
        mime: MIME_TYPES[fileExtension],
      };
    }

    return filesMap;
  };

  const fileMap = fileArrayToFilemap(processFolder(folderPath, folderPath));

  return (req, res, next) => {
    if (fileMap.hasOwnProperty(req.url)) {
      const fileRoute = fileMap[req.url];
      return res.sendFile(fileRoute.path, fileRoute.mime);
    } else {
      next();
    }
  };
};

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
