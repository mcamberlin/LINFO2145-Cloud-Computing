#!/bin/bash -
#===============================================================================
#
#          FILE: wait-for-couchdb.sh
#
#         USAGE: ./wait-for-couchdb.sh
#
#   DESCRIPTION:
#
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (raziel.carvajal@uclouvain.be), Paolo Laffranchini (paolo.laffranchini@student.uclouvain.be)
#  ORGANIZATION:
#       CREATED: 04/19/2018 20:24
#      REVISION:  ---
#===============================================================================
# any environment variable in this script is defined, this should
# be done during the deployment of a service or in a Dockerfile

until curl -X PUT ${DB_URL_USERS} ; do
  echo "Users Database wasn't created - sleeping"
  sleep 1
done
echo "Users Database created!"

until curl -X PUT ${DB_URL_SERVICES} ; do
  echo "Services Database wasn't created - sleeping"
  sleep 1
done
echo "Services Database created!"



echo "Apply a formatter for each view"
mkdir formatter_output
DEBUG=views* node func_to_string.js
if [[ ${?} != 0 ]]; then
  echo -e "ERROR: during the creation of views\nEND OF ${0}"
  exit 1
fi
echo -e "\tDONE"

cd formatter_output
echo "Creation of views for movielens DB"
for view in `ls *.js`; do
  curl -X PUT "${DB_URL_USERS}/_design/queries" --upload-file ${view}
  if [[ ${?} != 0 ]]; then
    echo -e "ERROR: during the creation of view ${view}\nEND OF ${0}"
    exit 1
  fi
done
echo -e "\tDONE"

npm start
