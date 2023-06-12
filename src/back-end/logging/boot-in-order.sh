#!/bin/bash -
#===============================================================================
#
#          FILE: boot-in-order.sh
#
#         USAGE: ./boot-in-order.sh
#
#   DESCRIPTION:
#     Waits until the daemon of CouchDB starts to create a database. The
#     environment variable DB_URL contains more details of such DB
#     (name, authentication information of administrator, etc).
#       OPTIONS: ---
#  REQUIREMENTS: This script makes use of the environment variables DB_NAME and
#     DB_URL, be sure that such variables were defined before running this script.
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/08/2018 09:20
#      REVISION:  ---
#===============================================================================
if [ "${WITH_PERSISTENT_DATA}" != "" ]; then
  echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME_USER_LOGS})."
  echo "The DB URL is: ${DB_URL_USERS}"
  until curl --request PUT ${DB_URL_USERS} ; do
    echo -e "\t DB (${DB_NAME_USER_LOGS}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME_USER_LOGS}) was created!"
fi

if [ "${WITH_PERSISTENT_DATA}" != "" ]; then
  echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME_SERVICES_LOGS})."
  echo "The DB URL is: ${DB_URL_SERVICES}"
  until curl --request PUT ${DB_URL_SERVICES} ; do
    echo -e "\t DB (${DB_NAME_SERVICES_LOGS}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME_SERVICES_LOGS}) was created!"
fi

echo "Start users service..."
npm start
