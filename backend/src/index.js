import app from './server.js';
import dotenv from 'dotenv';

dotenv.config({ path: './config/config.env' });

const PORT = process.env.PORT || 5000;

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
