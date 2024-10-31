# Financial Management Application

A full-stack financial management application built with **Node.js**, **Express**, **MongoDB**, **React**, and **Tailwind CSS**. This application allows users to manage their finances, track investments, and achieve financial goals.

## Table of Contents

- [Financial Management Application](#financial-management-application)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Features](#features)
  - [Demo](#demo)
  - [Technologies Used](#technologies-used)
  - [Prerequisites](#prerequisites)
  - [Project Structure](#project-structure)
  - [Installation and Setup](#installation-and-setup)
    - [Clone the Repository](#clone-the-repository)
  - [Configuration](#configuration)
    - [Environment Variables](#environment-variables)

## Project Overview

This application is designed to help users take control of their personal finances by providing tools for budgeting, tracking expenses, managing investments, and setting financial goals. It offers a user-friendly interface and insightful analytics to empower users to make informed financial decisions.

## Features

- **User Authentication**: Secure registration and login using JSON Web Tokens (JWT).
- **Transaction Management**: Add, edit, and delete income and expenses.
- **Budget Planning**: Create and monitor budgets to manage spending.
- **Investment Tracking**: Track investments with real-time updates using the Finnhub API.
- **Financial Goals**: Set and track progress toward financial goals.
- **Analytics Dashboard**: Visualize financial data with interactive charts and graphs.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Security Enhancements**: Input validation, sanitization, and security best practices implemented.

## Demo

[Include screenshots or a link to a live demo if available.]

## Technologies Used

- **Frontend**: React, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **API Integration**: Finnhub API for investment data
- **Containerization**: Docker, Docker Compose
- **Deployment**: Nginx (for frontend)
- **Other Libraries and Tools**: Chart.js, Redux (if used), etc.

## Prerequisites

- **Docker**: Install from [docker.com](https://www.docker.com/get-started) (if using Docker)
- **Node.js**: Install from [nodejs.org](https://nodejs.org/) (if running without Docker)
- **npm**: Comes with Node.js
- **MongoDB**: Install locally or use MongoDB Atlas (if not using Dockerized MongoDB)
- **Git**: For cloning the repository

## Project Structure

project-root/
├── backend/
│ ├── Dockerfile
│ ├── package.json
│ ├── .gitignore
│ ├── README.md
│ ├── src/
│ │ ├── server.js
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ └── middleware/
│ └── ...
├── frontend/
│ ├── Dockerfile
│ ├── package.json
│ ├── .gitignore
│ ├── README.md
│ ├── nginx.conf
│ ├── src/
│ │ ├── index.js
│ │ ├── components/
│ │ ├── pages/
│ │ └── assets/
│ └── ...
├── docker-compose.yml
├── README.md
├── .gitignore
└── .env


## Installation and Setup
### Clone the Repository

```bash
git clone https://github.com/your-username/financial-management-app.git
cd financial-management-app


## Configuration

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
Backend environment variables
JWT_SECRET=your_jwt_secret_key
FINNHUB_API_KEY=your_finnhub_api_key
CLIENT_URL=http://localhost:3000
MongoDB
MONGO_URI=mongodb://mongo:27017/financial_management_db
Frontend environment variables
REACT_APP_API_URL=http://backend:5000/api


**Note**: Replace `your_jwt_secret_key` and `your_finnhub_api_key` with your actual secret key and API key. Do not share or commit your `.env` file to version control.

## Running the Application

### Using Docker (Recommended)

#### Build and Run Containers

In the project root directory, run:

```bash
docker-compose up --build
```

This command will build and run the backend and frontend containers, and also run the MongoDB container. The application will be available at `http://localhost:3000`.

### Running the Application Without Docker



This command will:

- Build Docker images for the backend and frontend.
- Start the containers for the backend, frontend, and MongoDB services.

#### Access the Application

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

### Manual Setup (Without Docker)

#### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `backend/` directory:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    CLIENT_URL=http://localhost:3000
    FINNHUB_API_KEY=your_finnhub_api_key
    ```

4. Start the backend server:

    ```bash
    npm start
    ```

#### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the `frontend/` directory:

    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```

4. Start the frontend development server:

    ```bash
    npm start
    ```

## Scripts

### Backend Scripts

- `npm start` - Start the server.
- `npm run dev` - Start the server with nodemon for development.
- `npm test` - Run backend tests (if implemented).

### Frontend Scripts

- `npm start` - Start the development server.
- `npm run build` - Build the application for production.
- `npm test` - Run frontend tests (if implemented).

## Testing

Instructions for testing the application (if tests are implemented):

### Backend Tests


To run the backend tests, follow these steps:

1. Navigate to the `backend` directory:

    ```bash
    cd backend
    ```

2. Install dependencies (if not already done):

    ```bash
    npm install
    ```

3. Run the tests:

    ```bash
    npm test
    ```

This will execute the test suite using [Jest](https://jestjs.io/) and display the results in your terminal.



## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## **Additional Notes**

- **Security**: Ensure that sensitive information is not committed to version control.
- **API Keys**: Obtain necessary API keys (e.g., Finnhub API key) and keep them secure.
- **Docker**: Using Docker simplifies the setup process and ensures consistency across environments.
- **Feedback**: If you encounter any issues or have suggestions, please open an issue on GitHub.
