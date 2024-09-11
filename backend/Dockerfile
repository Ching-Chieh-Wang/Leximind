# Use a base image with Node.js
FROM node:14

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . .

# Expose the backend application port and the debug port
EXPOSE 4000 9229

# Start the backend application in debug mode using nodemon
CMD ["npm", "run", "dev"]
