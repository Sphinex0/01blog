# Stage 1: Build the Angular application
# FROM node:20 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# # Build the app for production
# RUN npm run build -- --configuration production

# # Stage 2: Serve the application from Nginx
# FROM nginx:alpine

# # --- UPDATE THIS LINE ---
# # Remove '/browser' from the source path
# COPY --from=build /app/dist/blog-frontend/browser /usr/share/nginx/html

# # Copy our custom Nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80



# Build stage
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

# Production stage
FROM nginx:alpine

# Copy built Angular app
COPY --from=build /app/dist/blog-frontend/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80