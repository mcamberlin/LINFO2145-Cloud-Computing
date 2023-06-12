# this image relies on the nodejs image
FROM node:18-alpine

# set working directory
WORKDIR /usr/src/scapp-recommendations
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/scapp-recommendations/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install

# source files of the recommendations service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .

# string to create tokens (see utils/en-de-coders.js)
ENV TOKEN_SECRET changeme

# header for loggining messages
ENV DEBUG recommendation-d

# non empty string use persitence (with CouchDB)
ENV WITH_PERSISTENT_DATA Y

# we now use an script to deploy the authentication service
CMD npm start
