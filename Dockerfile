# Use Node.js 22 on a lightweight Alpine Linux base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy all project files
COPY . .

# Install dependencies
RUN npm install

# Generate Prisma client and compile TypeScript
RUN npx prisma generate && npx tsc -b

# Start the server
CMD ["node", "dist/src/server.js"]