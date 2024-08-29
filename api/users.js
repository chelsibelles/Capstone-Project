const express = require("express");
const usersRouter = express.Router();
const { requireUser } = require("./utils");

usersRouter.get("/", requireUser, async (req, res, next) => {
  try {
    delete req.user.password;

    res.send({
      user: req.user,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = usersRouter;