# Use the combined Python and Node.js image
FROM nikolaik/python-nodejs:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before other files for caching
COPY backend/package*.json ./backend/

# Navigate to the backend directory
WORKDIR /app/backend

# Install Node.js dependencies
RUN npm install

# Copy backend files
COPY backend .

# Copy Python scripts and requirements
COPY backend/python_scripts ./python_scripts

# Install Python dependencies
RUN pip install -r python_scripts/requirements.txt

# Navigate back to the root directory
WORKDIR /app

# Copy frontend files and build the Angular app
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Copy the built files to the backend's public directory
RUN mkdir -p /app/backend/public && cp -R /app/frontend/dist/* /app/backend/public/

EXPOSE 8080

WORKDIR /app/backend

# Command to run backend
CMD ["npm", "run", "start"]