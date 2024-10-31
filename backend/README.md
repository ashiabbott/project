# Backend - Financial Management Application

This directory contains the backend code for the Financial Management Application, built with **Node.js** and **Express**. The backend provides RESTful API endpoints for the frontend to interact with.

## Table of Contents

- [Backend - Financial Management Application](#backend---financial-management-application)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Project Structure](#project-structure)
  - [Installation and Setup](#installation-and-setup)
    - [Navigate to the Backend Directory](#navigate-to-the-backend-directory)
    - [Install Dependencies](#install-dependencies)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
  - [Running the Server](#running-the-server)
    - [Development Mode](#development-mode)
    - [Production Mode](#production-mode)
    - [Connecting to MongoDB](#connecting-to-mongodb)
  - [API Endpoints](#api-endpoints)
    - [**Authentication**](#authentication)
    - [**Transactions**](#transactions)
    - [**Investments**](#investments)
    - [**Gamification**](#gamification)
  - [Docker Setup](#docker-setup)
    - [Build and Run with Docker Compose](#build-and-run-with-docker-compose)
    - [Standalone Docker Build](#standalone-docker-build)
  - [Testing](#testing)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

The backend handles user authentication, data storage, business logic, and communication with external APIs (e.g., Finnhub for investment data).

## Features

- **User Authentication**: Secure registration and login using JWT.
- **Transactions API**: CRUD operations for income and expenses, with pagination, sorting, and filtering.
- **Budgets API**: Set and manage monthly budgets.
- **Export API**: Export transactions and budgets in various formats (CSV, PDF, Excel, JSON, ZIP).
- **Gamification**: Achievements and rewards system to enhance user engagement.
- **Investments API**: Manage investments with real-time updates.
- **Goals API**: Set and track financial goals.
- **Middleware**: Input validation, error handling, and authentication middleware.
- **Security**: Use of Helmet, rate limiting, data sanitization, and other security best practices.

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcrypt** for password hashing
- **Axios** for HTTP requests
- **Finnhub API** for investment data
- **Nodemailer** for sending emails (if implemented)
- **Other Libraries**: helmet, express-validator, cors, dotenv, etc.

## Prerequisites

- **Node.js** and **npm**
- **MongoDB**: Local installation or MongoDB Atlas
- [Docker](https://www.docker.com/get-started) (if using Docker)

## Project Structure

```
backend/
├── Dockerfile
├── package.json
├── .gitignore
├── README.md
├── src/
│   ├── server.js
│   ├── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   ├── investmentController.js
│   │   └── ...
│   ├── models/
│   │   ├── User.js
│   │   ├── Transaction.js
│   │   ├── Investment.js
│   │   └── ...
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── transactionRoutes.js
│   │   ├── investmentRoutes.js
│   │   └── ...
│   ├── middleware/
│   │   ├── authenticate.js
│   │   ├── errorHandler.js
│   │   └── ...
│   ├── utils/
│   └── ...
├── tests/
│   └── ...
└── .env
```

## Installation and Setup

### Navigate to the Backend Directory

If you haven't already, navigate to the backend directory:

```bash
cd backend
```

### Install Dependencies

```bash
npm install
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
FINNHUB_API_KEY=your_finnhub_api_key
```

**Note**: Replace placeholders with your actual values. Keep this file secure and do not commit it to version control.

## Available Scripts

- `npm start`: Start the server.
- `npm run dev`: Start the server with nodemon (for development).
- `npm test`: Run tests (if implemented).

## Running the Server

### Development Mode

To run the server with auto-reloading using nodemon:

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

The server will start on the port specified in the `.env` file (default is `5000`).

### Connecting to MongoDB

Ensure that `MONGO_URI` in your `.env` file points to a running MongoDB instance.

- For local MongoDB:

  ```env
  MONGO_URI=mongodb://localhost:27017/financial_management_db
  ```

- For MongoDB Atlas, get the connection string from your Atlas account.

## API Endpoints

Detailed documentation of API endpoints:

### **Authentication**

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Log in an existing user.

### **Transactions**

- `GET /api/transactions`: Get all transactions for the authenticated user.
- `POST /api/transactions`: Create a new transaction.
- `PUT /api/transactions/:id`: Update a transaction.
- `DELETE /api/transactions/:id`: Delete a transaction.

### **Investments**

- `GET /api/investments`: Get all investments for the authenticated user.
- `POST /api/investments`: Create a new investment.
- `PUT /api/investments/:id`: Update an investment.
- `DELETE /api/investments/:id`: Delete an investment.

### **Gamification**

- **Achievements**
  - `GET /api/achievements`: Get all achievements for the authenticated user, including which have been earned.
  - `GET /api/achievements/all`: Get all available achievements.
- **Gamification Actions**
  - `POST /api/gamification/check-achievements`: Checks and awards new achievements for the user.
  - `GET /api/gamification/achievements`: Retrieves the user's achievements and total points.
  - `POST /api/gamification/redeem`: Redeem a reward using accumulated points. Requires `rewardId` in the body.

[Include descriptions, request and response examples, and any required authentication headers.]

## Docker Setup

### Build and Run with Docker Compose

From the project root directory:

```bash
docker-compose up --build
```

This will build and start the backend service along with the frontend and MongoDB.

### Standalone Docker Build

To build and run the backend Docker image independently:

```bash
# Build the Docker image
docker build -t financial-backend .

# Run the Docker container
docker run -p 5000:5000 --env-file .env financial-backend
```

## Testing

To run tests (if implemented):

```bash
npm test
```

## Contributing

We welcome contributions! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to get involved.

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
