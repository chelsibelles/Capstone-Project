const express = require("express");
const usersRouter = express.Router();
const { requireUser } = require("./utils");

usersRouter.get("/", requireUser, async (req, res, next) => {
  try {
    // Ensure `req.user` is defined and contains the necessary fields
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated.' });
    }

    // Remove sensitive data before sending the response
    const { password, ...userWithoutPassword } = req.user;

    res.send({
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    next({ name: "InternalServerError", message: "An error occurred while fetching user data." });
  }
});

module.exports = usersRouter;
