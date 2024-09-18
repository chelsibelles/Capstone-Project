require('dotenv').config();
const app = require('./server');  // Import the Express app instance

const PORT = 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
