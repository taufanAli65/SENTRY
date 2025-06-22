FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build TypeScript code
RUN npm run build

# Expose the port (default 8000, can be overridden by env)
EXPOSE 8010

# Set environment variables (can be overridden at runtime)
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]
