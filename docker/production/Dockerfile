# Use the official Node.js 22 image as the builder
FROM node:22 AS builder

# Set the working directory inside the container
WORKDIR /build

# Copy package.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Use a smaller Node.js 22 Alpine image for the runner
FROM node:22-alpine AS runner

# Set environment variable to production
ENV NODE_ENV=production

# Set the working directory inside the container
WORKDIR /app

# Copy package.json from the builder stage
COPY --from=builder /build/package.json ./

# Install production dependencies , handle bcrypt separately and install pm2
RUN npm install --ignore-scripts --omit=dev \
  && npm uninstall bcrypt \
  && npm install bcrypt \
  && npm install pm2 -g \
  && pm2 update

# Copy the built application from the builder stage
COPY --from=builder /build/dist/ .

# Expose port 5000
EXPOSE 5000

# Start the application
CMD ["pm2-runtime", "src/index.js"]