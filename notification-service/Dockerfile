# Use Node.js 22 on a lightweight Alpine Linux base
FROM node:22-alpine

# Install OpenSSL (required by Prisma if used)
RUN apk add --no-cache openssl

# Set the working directory inside the container
WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm install

# Compile TypeScript (no Prisma schema in this service)
RUN npx tsc -b

# Start the server
CMD ["node", "dist/src/server.js"]