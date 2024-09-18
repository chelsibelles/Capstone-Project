const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
const { requireUser } = require("./utils");

// Initialize the Express application
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', // Allow your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
  credentials: true, // Allow credentials (if needed)
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers in requests
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS configuration
app.use(express.json()); // Parse JSON bodies

// Middleware to set `req.user` if possible
app.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // No Authorization header present
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, process.env.JWT_SECRET || "super secret super safe");

      if (id) {
        req.user = await getUserById(id);
        next();
      } else {
        next({
          name: "AuthorizationHeaderError",
          message: "Authorization token malformed",
        });
      }
    } catch (error) {
      next({
        name: error.name || "AuthorizationError",
        message: error.message || "Failed to authenticate token",
      });
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authorization token must start with ${prefix}`,
    });
  }
});

// Import routers
const usersRouter = require("./users");
const flowersRouter = require("./flowers");

// Use routers
app.use("/api/users", usersRouter);
app.use("/api/flowers", requireUser, flowersRouter);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error); // Log error for debugging
  res.status(error.status || 500).json({
    name: error.name || "InternalServerError",
    message: error.message || "An error occurred",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
