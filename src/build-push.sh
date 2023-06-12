DOCKER_ID=mcamberlin


cd front-end
docker build -t scapp-front-end .
docker tag scapp-front-end ${DOCKER_ID}/scapp-front-end
docker push ${DOCKER_ID}/scapp-front-end

cd ../back-end/products
docker build -t scapp-products .
docker tag scapp-products ${DOCKER_ID}/scapp-products
docker push ${DOCKER_ID}/scapp-products

cd ../purchase
docker build -t scapp-purchase .
docker tag scapp-purchase ${DOCKER_ID}/scapp-purchase
docker push ${DOCKER_ID}/scapp-purchase

cd ../logging
docker build -t scapp-logs .
docker tag scapp-logs ${DOCKER_ID}/scapp-logs
docker push ${DOCKER_ID}/scapp-logs

cd ../users
docker build -t scapp-auth .
docker tag scapp-auth ${DOCKER_ID}/scapp-auth
docker push ${DOCKER_ID}/scapp-auth

cd ../storage
docker build -t scapp-db .
docker tag scapp-db ${DOCKER_ID}/scapp-db
docker push ${DOCKER_ID}/scapp-db

cd ../recommendation
docker build -t scapp-recommendations .
docker tag scapp-recommendations ${DOCKER_ID}/scapp-recommendations
docker push ${DOCKER_ID}/scapp-recommendations