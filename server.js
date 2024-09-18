const cors = require('cors');
const express = require('express');
const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow your frontend's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allow common HTTP methods
  credentials: true,  // Allow credentials (if needed)
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers in requests
};

// Apply CORS middleware globally with options
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api", require("./api")); // Ensure this file is correctly exporting your routes
const authRouter = require('./auth/auth'); // Ensure this file is correctly exporting your routes
app.use('/auth', authRouter);

// Handle preflight requests explicitly if needed
app.options('*', cors(corsOptions));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
