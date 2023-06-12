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
  echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME_PRODUCTS})."
  echo "The DB URL is: ${DB_URL_PRODUCTS}"
  until curl --request PUT ${DB_URL_PRODUCTS} ; do
    echo -e "\t DB (${DB_NAME_PRODUCTS}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME_PRODUCTS}) was created!"
fi

if [ "${WITH_PERSISTENT_DATA}" != "" ]; then
  echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME_CATEGORIES})."
  echo "The DB URL is: ${DB_URL_CATEGORIES}"
  until curl --request PUT ${DB_URL_CATEGORIES} ; do
    echo -e "\t DB (${DB_NAME_CATEGORIES}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME_CATEGORIES}) was created!"
fi

echo "Start scapp-products..."
npm start
