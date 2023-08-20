# Use a base image with both Node and Python
FROM nikolaik/python-nodejs:latest
#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for npm installations
COPY ./package.json ./
COPY ./package-lock.json ./

# Install npm packages
RUN npm install

# Copy the Python requirements file
COPY ./python_scripts/requirements.txt ./python_scripts/

# Install Python dependencies
RUN pip install -r ./python_scripts/requirements.txt

# Copy the entire backend code
COPY . .

# Expose the port your backend runs on
EXPOSE 3000

# Command to run your backend
CMD ["npm", "run", "start"]
