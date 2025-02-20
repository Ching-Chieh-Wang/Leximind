# ===========================
# Base Stage
# ===========================
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV development
ENV PORT 3000

# Start Next.js in development mode (dynamically builds pages)
CMD ["npm", "run", "dev"]