# this image relies on the nodejs image
FROM node:18-alpine

# set working directory
WORKDIR /usr/src/scapp-logs
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/scapp-logs/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
# source files of the authentication service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .

COPY func_to_string.js ./
COPY fill_db.sh ./
COPY wait-for-couchdb.sh ./

# string to create tokens (see utils/en-de-coders.js)
ENV TOKEN_SECRET changeme
# header for loggining messages
ENV DEBUG log-d
# non empty string use persitence (with CouchDB)
ENV WITH_PERSISTENT_DATA Y

# name of container running CouchDB
ENV DB_HOST logs-db
# database name
ENV DB_NAME_USER_LOGS users-logs
ENV DB_NAME_SERVICES_LOGS services-logs

# authentication information to CRUD (create/remove/update/delete) objects in our DB
ENV ADMIN_NAME admin
ENV ADMIN_PASSW admin
ENV DB_URL_USERS http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:5984/${DB_NAME_USER_LOGS}
ENV DB_URL_SERVICES http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:5984/${DB_NAME_SERVICES_LOGS}

# we now use an script to deploy the authentication service
#CMD source boot-in-order.sh

CMD source wait-for-couchdb.sh
