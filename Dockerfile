# Stage 1: Build the governance-ai app
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if using npm) to the container
COPY governance-ai/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY governance-ai .

# Build the governance-ai app for production
RUN npm run build

# Start the server to serve the governance-ai app
CMD [ "node", "/app/dist/main.js"]
