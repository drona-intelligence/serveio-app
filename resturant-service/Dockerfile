FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (with dummy DATABASE_URL for build)
RUN DATABASE_URL="postgresql://user:password@localhost:5432/dummy" npm run prisma:generate || true

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
