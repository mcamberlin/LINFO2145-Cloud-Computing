IP_VM=192.168.56.102
./build
docker swarm init --advertise-addr ${IP_VM}
docker network create --driver overlay --attachable scapp-net
docker stack deploy -c scapp-back-end.yml scapp