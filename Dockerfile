FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY smithery.yaml ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Command will be provided by smithery.yaml
CMD ["node", "build/index.js"]
