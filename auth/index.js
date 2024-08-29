const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername } = require('../db/users');

const authRouter = express.Router();

// Middleware for token authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // Unauthorized if no token

  jwt.verify(token, process.env.JWT || 'super secret super safe', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
};

// Register route
authRouter.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username already taken
    const user = await getUserByUsername(username);
    if (user) {
      return res.status(409).send({
        name: 'UserExistsError',
        message: 'A user by that username already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT || 5)
    );

    // Create new user in the database
    const newUser = await createUser({ ...req.body, password: hashedPassword });

    // Create a token with the user id
    const token = jwt.sign(
      { id: newUser.user_id },
      process.env.JWT || 'super secret super safe'
    );

    // Send the response
    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login route
authRouter.post('/login', async (req, res, next) => {
  try {
    // Find the user by username
    const user = await getUserByUsername(req.body.username);
    if (!user) return res.status(401).send("Invalid login credentials.");

    // Check password
    const isSamePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isSamePassword) return res.status(401).send("Invalid login credentials.");

    // Create a token with the user id
    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT || 'super secret super safe'
    );

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route.');
});

module.exports = authRouter;
