FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

COPY smithery.yaml /app/smithery.yaml

# Build the application
RUN npm run build

# Command will be provided by smithery.yaml
CMD ["node", "build/index.js"]
