# How to test ?

1. Run the isolated stack using the `deploy-isolated-services.sh` script
    > This script stop & run all the microservices in an isolated manner using the `BUILD_ENV===test` flag. This allow to prevent microservices to really communicate but to return default values to prevent side effects. In case of modification of the microservices, the script will rebuild the microservices and restart them (at the next start of the script).
2. Install the following python lib `python3 -m pip install requests pytest`
3. Run the tests using the command `pytest . --ip <ip of the swarm manager>`

# How to add more tests ?

> Important note : In multiple microservice the flag `BUILD_ENV===test` is used to prevent the microservice to really communicate with other microservices. This flag is used to prevent side effects. Please use this flag when communication with other microservices is required to making possible to isolate them or to change their behavior in a test environment.
> Please keep up to date the default behavior of theses microservices when the flag is set.

1. Add a new file in the `tests` folder of the microservice you want to test
2. Create a file starting with `test_` and ending with `.py`
3. In this file create a function starting with `test_`
4. To make a request to the microservice stack, add the `ip` parameter to the function and use it to make the request as `url = f"http://{ip}:<port of the microservice>/<path of the endpoint>"`

# How to deploy on azure ?

0. (Optionnal) Build the application using the `build` script for local development or `build-push.sh` for production. Please customize the dockerhub id *DOCKER_ID* in your script and in the `scapp-azure.yml` file.
1. (Optional) Create a service account on azure storage, and create a container. Then, update the environement variable in scapp-azure.yml for the service products. If you don't do this, the service will use the default azure storage account. > Note: Be careful to allow the public access to the container.
    > In case of customization of the blob, please be careful to update the `scapp-azure.yml` file with the correct environement variables. Also please not that `AZURE_SAS` environement variable should start with `?`
2. Setup your azure account on your computer using the command `az login`
3. Run the script `deploy-azure.sh` to deploy the infrastructure on azure. Customisation of this script is optional. The deployment will take around 10 minutes. After the script is executed please wait a few minutes for the services to be deployed.
    > In case of failure, this may be because of a wrong password of a dns not yet propagated. In this case, please copy the command that failed and run it again and end the deployment manualy by copy pasting the commands. It may be necessary to copy the environment variables defined in the script.
    > DEFAULT PASSWORD: `Safe0!`
    > Note: You can change the parameter at the start of the script. You will have to enter the password multiple times for establishing the ssh connection. If you change the DNS and github, you will have to change it in the `scapp-azure.yml` file for the frontend address on the following schema `http://${MASTER_DNS}-${GITHUB_ACCOUNT}.westeurope.cloudapp.azure.com`
4. Access the website using the url returned by the script.

## What is deployed ?

-   A virtual machine with docker installed as a swarm manager
-   A virtual machine with docker installed as a swarm worker
-   Network security group to allow the communication between the swarm manager, the swarm worker and internet
-   Binding the network security groups to the virtual machines
-   Deploying the docker stack using the `docker stack deploy` command and the `scapp-azure.yml` file

## How to delete the infrastructure ?

Please go on you azure dashboard and delete the ressource group named `linfo2145.weu`
