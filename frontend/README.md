# Eniuche Financial Application

Manage your finances with a beautifully futuristic interface.

![App Preview](./public/images/app-preview.png)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
    - [Development Server](#development-server)
    - [Production Preview](#production-preview)
  - [Building for Production](#building-for-production)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Code Quality](#code-quality)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

The Eniuche Financial Application is a modern web application designed to help users manage their finances efficiently. With a sleek, futuristic interface, you can track your spending, set budgeting goals, and monitor your investments all in one place.

## Features

- **Real-time Budget Tracking**: Keep an eye on your spending with up-to-date analytics.
- **Investment Monitoring**: View and manage your investment portfolio effortlessly.
- **Goal Setting**: Set financial goals and track your progress.
- **AI Financial Advisor**: Receive personalized financial advice powered by AI.
- **Responsive Design**: Access your data on any device, anywhere.
- **Secure Authentication**: Protect your data with secure login and authentication.

## Demo

Check out a live demo of the application at [https://eniuchefinance.com](https://eniuchefinance.com).

> **Note**: Replace `https://eniuchefinance.com` with your actual domain if different.

## Prerequisites

- **Node.js** version 14.x or higher
- **Yarn** package manager (recommended) or npm
- **Git** for version control

## Getting Started

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Eniuche/eniuche-financial-app.git
   cd eniuche-financial-app/frontend
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

### Running the App

#### Development Server

Start the development server with hot reloading:

```bash
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

#### Production Preview

Build and preview the production build locally:

```bash
yarn build
yarn preview
```

The app will be available at [http://localhost:4173](http://localhost:4173).

### Building for Production

Build the application for production deployment:

```bash
yarn build
```

The production-ready files will be in the `dist` directory.

## Configuration

### Environment Variables

Create a `.env` file in the root directory and add the necessary environment variables:

```env
# .env
VITE_API_URL=http://localhost:5002/api
```

- **VITE_API_URL**: The base URL for the backend API.

> **Note**: Update `VITE_API_URL` with the actual URL of your backend server if it's different.

## Technology Stack

- **Frontend**:

  - [React](https://reactjs.org/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Vite](https://vitejs.dev/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Redux Toolkit](https://redux-toolkit.js.org/)
  - [React Router](https://reactrouter.com/)
  - [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
  - [Framer Motion](https://www.framer.com/motion/) for animations
  - [Axios](https://axios-http.com/) for HTTP requests

- **Backend** (Placeholder):
  - _(Provide details about the backend if applicable)_

## Project Structure

```plaintext
frontend/
├── public/
   ├── index.html
│   └── images/
│       ├── app-preview.png
│       └── social-preview.png
├── src/
│   ├── components/
│   ├── pages/
│   ├── store/
│   ├── styles/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
├── package.json
├── yarn.lock
└── README.md
```

- **public/**: Static files served directly.
- **src/**: Application source code.
  - **components/**: Reusable UI components.
  - **pages/**: Page components for routing.
  - **store/**: Redux state management.
  - **styles/**: Global and component-specific styles.
- **App.tsx**: Root component.
- **main.tsx**: Entry point.
- **index.css**: Global styles.
- **Configuration files**: Setup for TypeScript, ESLint, Prettier, Tailwind CSS, and Vite.

## Testing

Run unit and integration tests:

```bash
yarn test
```

Or to run tests in watch mode:

```bash
yarn test:watch
```

> **Note**: Ensure that Jest and testing libraries are properly configured in your project.

## Code Quality

Ensure code quality with linting and formatting:

- **Lint**:

  ```bash
  yarn lint
  ```

- **Format**:

  ```bash
  yarn format
  ```

Pre-commit hooks will automatically run linting and formatting on staged files.

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**.
2. **Create a new branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Commit your changes**:

   ```bash
   git commit -m "Add your feature"
   ```

4. **Push to the branch**:

   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**.

Please ensure your code follows the project's coding standards and includes tests where applicable.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Contact

- **Author**: Eniuche
- **Email**: [eniuche@example.com](mailto:eniuche@example.com)
- **GitHub**: [Eniuche](https://github.com/Eniuche)
