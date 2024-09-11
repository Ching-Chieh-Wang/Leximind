# Use a base image with Node.js
FROM node:14

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install all dependencies (including devDependencies if NODE_ENV is not production)
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the backend application port
EXPOSE 3000

# Start the backend application using nodemon for development
CMD ["npm", "run", "dev"]
