// src/server.js

import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import csurf from 'csurf';
import path from 'path';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url'; // Import fileURLToPath

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Convert import.meta.url to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent cross-site scripting (XSS) attacks
app.use(xss());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Prevent HTTP parameter pollution
app.use(hpp());

// Enable CSRF protection
app.use(csurf({ cookie: true }));

// CSRF Token Middleware - Set CSRF token cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: true });
  next();
});

// Logging middleware (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routes
app.use('/api', routes);

// Error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
