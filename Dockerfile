ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package.json package.json

# Install npm dependencies without using the dev packages
RUN npm install

# Run the application as a non-root user.
USER root

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start