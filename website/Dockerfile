FROM node:23 AS base

# Set working directory
WORKDIR /app

# Development stage
FROM base AS dev

# Expose port (if your application runs on a specific port, e.g., 3000)
EXPOSE 3001

# Copy npm package files (and any locks) and install dependencies
COPY package*.json ./
RUN npm ci

# Command to run the application in development mode
CMD ["npm", "run", "dev"]