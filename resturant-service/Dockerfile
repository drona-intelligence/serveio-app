FROM node:20-alpine

# Prisma needs OpenSSL to run its query/migration engines on Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma Client explicitly
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Run migrations and start the application
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]