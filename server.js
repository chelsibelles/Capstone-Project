const express = require("express");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Working");
});

// Non-auth routes
server.use("/api", require("./api"));

// Auth routes
server.use("/auth", require("./auth"));

// Error handling
server.use((error, req, res, next) => {
  console.error("Error:", error); // Add logging for debugging
  res.status(500).send({ error });
});

module.exports = server;
