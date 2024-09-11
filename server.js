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
  res.status(500).send({ error: "Internal Server Error" }); // More user-friendly error message
});

// Start the server if this file is run directly
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = server;
