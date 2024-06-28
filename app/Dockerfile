# Stage 1: Build stage
FROM node:22-alpine AS builder

ENV NODE_ENV=production
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Install Vite and plugins
RUN yarn add vite @vitejs/plugin-react daisyui

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Production stage
FROM nginx

# Copy built assets from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
