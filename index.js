require('dotenv').config();
const app = require('./server');  // Import the Express app instance

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
