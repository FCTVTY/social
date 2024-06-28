# Fetching the latest node image on Alpine Linux
FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Copying package.json and yarn.lock first
COPY package.json yarn.lock ./

RUN npm cache clean --force
RUN rm -rf node_modules yarn.lock


# Copying all the files in our project
COPY . .
RUN yarn add vite --dev
RUN yarn add daisyui --dev
RUN yarn add @vitejs/plugin-react


# Installing dependencies
RUN yarn install --frozen-lockfile

# Building our application
RUN yarn build

# Fetching the latest nginx image
FROM nginx

# Copying built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copying our nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
