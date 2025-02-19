# ===========================
# Step 1: Base Stage
# ===========================
# Use Node.js 18 Alpine for a small and efficient image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy the entire project
COPY . .

# Expose the application port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV production

# Start the application
CMD ["npm", "start"]