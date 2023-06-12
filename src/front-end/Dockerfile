# this image relies on the nodejs image, based on the Alpine minimal Linux distribution
FROM node:alpine

# set the working directory
WORKDIR /usr/src/scapp-front-end

# copy the configuration file into the working directory
COPY package.json .

# install dependencies
RUN npm install

# copy the source code
COPY public public
COPY src src

ENV MYIP 192.168.56.102

ENV REACT_APP_AUTH_SERVICE_URL http://${MYIP}:3001 
ENV REACT_APP_PURCHASE_SERVICE_URL http://${MYIP}:3003 
ENV REACT_APP_LOG_SERVICE_URL http://${MYIP}:3005
ENV REACT_APP_PRODUCTS_SERVICE_URL http://${MYIP}:3007
ENV REACT_APP_RECOMMENDATIONS_SERVICE_URL http://${MYIP}:3009
# deploy the front-end
CMD npm start
