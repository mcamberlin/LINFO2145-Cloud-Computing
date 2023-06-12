# Stop and remove previous docker containers

# scapp-logs, db-logs
docker stop scapp-logs && docker rm scapp-logs
docker stop logs-db && docker rm logs-db

# scapp-products, db-products
docker stop scapp-products && docker rm scapp-products
docker stop products-db && docker rm products-db

# scapp-purchase, db-purchase
docker stop scapp-purchase && docker rm scapp-purchase
docker stop purchase-db && docker rm purchase-db

#scapp-auth, db-users
docker stop scapp-auth && docker rm scapp-auth
docker stop users-db && docker rm users-db

#scapp-recommendation
docker stop scapp-recommendations && docker rm scapp-recommendations


# Build and run all services and their corresponding database

# scapp-logs, db-logs
cd back-end/logging
docker build -t scapp-logs .
docker run -d -p 3006:80 --name logs-db  scapp-db
docker run -d -p 3005:80 --name scapp-logs -e BUILD_ENV=test --link logs-db scapp-logs

# scapp-products, db-products
cd ../products
docker build -t scapp-products .
docker run -d -p 3008:80 --name products-db scapp-db
docker run -d -p 3007:80 --name scapp-products -e BUILD_ENV=test --link products-db scapp-products
# scapp-purchase, db-purchase
cd ../purchase
docker build -t scapp-purchase .
docker run -d -p 3004:80 --name purchase-db  scapp-db
docker run -d -p 3003:80 --name scapp-purchase -e BUILD_ENV=test --link purchase-db scapp-purchase
#scapp-auth, db-users
cd ../users
docker build -t scapp-auth .
docker run -d -p 3002:5984 --name users-db scapp-db
docker run -d -p 3001:80 --name scapp-auth -e BUILD_ENV=test --link users-db scapp-auth

cd ../recommendation
docker build -t scapp-recommendations .
docker run -d -p 3009:80 --name scapp-recommendations -e BUILD_ENV=test scapp-recommendations