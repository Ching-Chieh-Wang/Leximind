# ===========================
# Step 1: Build Stage
# ===========================
# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy the entire project
COPY . .

# Build Next.js application
RUN npm run build

# ===========================
# Step 2: Production Stage
# ===========================
# Use a smaller base image for serving the application
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose the application port
EXPOSE 3000

# Set environment variables for production
ENV NODE_ENV production
ENV PORT 3000

# Start Next.js in production mode
CMD ["npm", "start"]