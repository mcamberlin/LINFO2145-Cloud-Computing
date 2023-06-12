# maintainer Raziel Carvajal-Gomez <raziel.carvajal-gomez@uclouvain.be>

# this image relies on the nodejs image
FROM node:16-alpine 
# change version of node to solve error-digital-envelope-routines-unsupported

ENV PATH /usr/src/scapp-fe-doc/node_modules/.bin:${PATH}

# your workspace
WORKDIR /usr/src/scapp-fe-doc

# copy the configuration file into the workspace
COPY package.json .

# install dependencies
RUN npm install

# copy source files
COPY doczrc.js .
COPY src src

# deploy the front end
CMD docz serve
