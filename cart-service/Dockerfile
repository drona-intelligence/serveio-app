# Use Node.js 22 on a lightweight Alpine Linux base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Generate Prisma client and compile TypeScript
RUN npx prisma generate && npm run build

# Expose port
EXPOSE 3003

# Run migrations and start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/server.js"]
