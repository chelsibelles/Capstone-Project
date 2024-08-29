const express = require("express");
const cors = require("cors");
const apiRouter = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
const { requireUser } = require("./utils");

// Initialize the Express application
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON bodies

// Middleware to set `req.user` if possible
apiRouter.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");

  if (!auth) {
    // No Authorization header present
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(
        token,
        process.env.JWT || "super secret super safe"
      );

      if (id) {
        req.user = await getUserById(id);
        next();
      } else {
        next({
          name: "AuthorizationHeaderError",
          message: "Authorization token malformed",
        });
      }
    } catch ({ name, message }) {
      next({ name, message });
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
apiRouter.use("/users", usersRouter);
apiRouter.use("/flowers", requireUser, flowersRouter);

// Error handling middleware
apiRouter.use((error, req, res, next) => {
  res.status(error.status || 500).send({
    name: error.name || "InternalServerError",
    message: error.message || "An error occurred",
  });
});

// Mount the API router on the app
app.use("/api", apiRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
