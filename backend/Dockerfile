# Use a base image with Node.js
FROM node:14

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (this includes bcrypt)
RUN npm install

# Rebuild native modules like bcrypt to ensure compatibility with the container
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code into the container
COPY . .

# Expose the backend application port
EXPOSE 3000

# Start the backend application using npm run dev for development
CMD ["npm", "run", "dev"]