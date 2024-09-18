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

  jwt.verify(token, process.env.JWT_SECRET || 'super secret super safe', (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if token is invalid
    req.user = user;
    next();
  });
};

// Register route
authRouter.post('/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if username already taken
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        name: 'UserExistsError',
        message: 'A user with that username already exists',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10', 10));

    // Create new user in the database
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword,
    });

    // Create a token with the user id
    const token = jwt.sign(
      { id: newUser.user_id },
      process.env.JWT_SECRET || 'super secret super safe',
      { expiresIn: '1h' } // Set token expiration time
    );

    // Send the response
    res.status(201).json({ token });
  } catch (error) {
    console.error(error);
    next({ name: 'InternalServerError', message: 'An error occurred during registration.' });
  }
});

// Login route
authRouter.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find the user by username
    const user = await getUserByUsername(username);
    if (!user) return res.status(401).json({ message: 'Invalid login credentials.' });

    // Check password
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (!isSamePassword) return res.status(401).json({ message: 'Invalid login credentials.' });

    // Create a token with the user id
    const token = jwt.sign(
      { id: user.user_id },
      process.env.JWT_SECRET || 'super secret super safe',
      { expiresIn: '1h' } // Set token expiration time
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    next({ name: 'InternalServerError', message: 'An error occurred during login.' });
  }
});

// Protected route example
authRouter.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route.');
});

module.exports = authRouter;
