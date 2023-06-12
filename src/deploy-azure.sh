MASTER_DNS=swarm-master-test
SLAVE1_DNS=swarm-slave1-test
SLAVE2_DNS=swarm-slave2-test

GITHUB_ACCOUNT=ery4z

USERNAME_ADMIN=myadmin
PASSWORD=Safe0!
clear 
echo "Deploying infrastructure..."
az group create --name linfo2145.weu --location westeurope



echo "Creating master node..."
echo "DNS: $MASTER_DNS"
echo "GITHUB_ACCOUNT: $GITHUB_ACCOUNT"
echo "USERNAME_ADMIN: $USERNAME_ADMIN"
echo "password: $PASSWORD"

az group deployment create --resource-group linfo2145.weu --template-uri https://tinyurl.com/lingi2145-azure-template --parameters dnsNameForPublicIP=${MASTER_DNS} gitHubAccount=${GITHUB_ACCOUNT} adminUsername=${USERNAME_ADMIN} adminPassword=${PASSWORD} 


echo "Creating slave1 node..."
echo "DNS: $SLAVE1_DNS"
echo "GITHUB_ACCOUNT: $GITHUB_ACCOUNT"
echo "USERNAME_ADMIN: $USERNAME_ADMIN"
echo "password: $PASSWORD"

az group deployment create --resource-group linfo2145.weu --template-uri https://tinyurl.com/lingi2145-azure-template --parameters dnsNameForPublicIP=${SLAVE1_DNS} gitHubAccount=${GITHUB_ACCOUNT} adminUsername=${USERNAME_ADMIN} adminPassword=${PASSWORD}



echo "Creating network..."

# 80,8080,22,3000-3010,2377,7946,4789
az network nsg create -g linfo2145.weu -n my-net-sec-group-test
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule80 --priority 100 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 80
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule8080 --priority 101 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 8080
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule22 --priority 102 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 22
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule30003010 --priority 103 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 3000-3010
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule2377 --priority 104 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 2377
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule7946 --priority 105 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 7946
az network nsg rule create -g linfo2145.weu --nsg-name my-net-sec-group-test -n MyNsgRule4789 --priority 106 --access Allow --protocol Tcp --direction Inbound --source-address-prefix '*' --source-port-range '*' --destination-address-prefix '*' --destination-port-range 4789

az network nic update -g linfo2145.weu -n ${MASTER_DNS}-Nic --network-security-group my-net-sec-group-test
az network nic update -g linfo2145.weu -n ${SLAVE1_DNS}-Nic --network-security-group my-net-sec-group-test

ssh-keygen -R ${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com
ssh-keygen -R ${SLAVE1_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com
clear
echo "Setuping the VM..."
scp scapp-azure.yml ${USERNAME_ADMIN}@${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com:~/
ssh ${USERNAME_ADMIN}@${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com << EOF
    dig +short myip.opendns.com @resolver1.opendns.com | xargs docker swarm init --advertise-addr
    docker network create --driver overlay --attachable scapp-net
    docker swarm join-token worker | grep "docker swarm join" > join.sh
    exit
EOF
scp ${USERNAME_ADMIN}@${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com:~/join.sh ${USERNAME_ADMIN}@${SLAVE1_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com:~/

ssh ${USERNAME_ADMIN}@${SLAVE1_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com << EOF
    bash join.sh
    exit
EOF

echo "Deploying the stack..."
ssh ${USERNAME_ADMIN}@${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com << EOF
    docker stack deploy -c scapp-azure.yml scapp
    exit
EOF

echo "Done!"
echo "website: http://${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com:3000"

