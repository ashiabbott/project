# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if they exist)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Expose the backend port (use the same port as defined in your server)
EXPOSE 5000

# Start the backend server
CMD [ "npm", "start" ]