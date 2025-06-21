# Use Node.js 18 as base image
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Ensure devDependencies are installed
ENV NODE_ENV=development
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]