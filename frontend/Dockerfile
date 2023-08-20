# Use a Node base image
FROM node:latest

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm installations
COPY ./package.json ./
COPY ./package-lock.json ./

# Install npm packages
RUN npm install

# Copy the entire frontend code
COPY . .

# Expose the port your frontend runs on
EXPOSE 4200

# Command to serve the Angular app
#CMD ["npm", "start"]

# If we want to run docker application locally then we use this command
CMD ["npm", "run", "startDocker"]
