# Stage 1: Build the React application
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the built files from the previous stage to the Nginx HTML folder
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 5173

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
