# Fetching the latest node image on Alpine Linux
FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Installing dependencies
COPY ./package.json ./

RUN npm install
RUN npm install vite --save-dev
RUN npm i @rollup/rollup-linux-x64-musl
# Copying all the files in our project
COPY . .

# Run the script to update manifest.json


# Building our application
RUN npm run build

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5000