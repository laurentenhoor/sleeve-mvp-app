#!/bin/bash

############## README ################
##
## Configuration
##
## 1. Copy this script in your local app root folder
## 2. Make the script executable: chmod +x deploy-meteor.sh
## 3. Add bundle/ to your .gitignore file
## 4. Make sure that mongoDb is already running on the server
## 5. Edit variables
## 6.
##    a. Run with ./deploy-meteor.sh prod (to deploy to production)
##    b. Run with ./deploy-meteor.sh (to deploy to staging)
##
##
## Tested with server:
##
## Ubuntu 14.04.4 LTS
## meteor --version 1.3.2.4
## node --version v0.10.41
## npm --version 3.10.3
##
## Author:
## Samuel Lissner <http://www.slissner.de>

## Variables

############# Production ###########
DEPLOY_ENV="prod"

APP_NAME="sleeve"
APP_PROCESS_NAME="sleeve-production"
LOCAL_BUNDLE_DIR="bundle/"
LOCAL_ARCHITECTURE="os.linux.x86_64"

SERVER_USER="root"
SERVER_HOST="185.137.12.135"
SERVER_PASS="MhfhcJfc8ZphLJ"

SERVER_INIT_SCRIPT="sleeve_init_forever.conf"

SERVER_APP_ROOT_PATH="/opt"
SERVER_APP_DIR_NAME="sleeve"
SERVER_MONGO_HOST="localhost"
SERVER_MONGO_PORT="27017"
SERVER_MONGO_DBNAME="sleeve"
SERVER_PORT="4000"
SERVER_ROOT_URL="http://185.137.12.135:4000/"


echo ""
echo "###################"
echo "## meteor deploy ##"
echo "###################"
echo ""
echo "Deploy environment: ${DEPLOY_ENV}"
echo ""
echo "Deploy process of app $APP_NAME to $SERVER_HOST started"
echo ""

# build + bundle
# npm install
rm $LOCAL_BUNDLE_DIR*.tar.gz
meteor build $LOCAL_BUNDLE_DIR --architecture $LOCAL_ARCHITECTURE --allow-superuser && mv $LOCAL_BUNDLE_DIR*.tar.gz $LOCAL_BUNDLE_DIR$APP_NAME.tar.gz

ssh-keygen -R ${SERVER_HOST}

# copy to server
sshpass -p ${SERVER_PASS} scp -o StrictHostKeyChecking=no ${LOCAL_BUNDLE_DIR}${APP_NAME}.tar.gz ${SERVER_USER}@${SERVER_HOST}:${SERVER_APP_ROOT_PATH} 

# copy to server
sshpass -p ${SERVER_PASS} scp -o StrictHostKeyChecking=no ${SERVER_INIT_SCRIPT} ${SERVER_USER}@${SERVER_HOST}:/etc/init 

# ssh
sshpass -p ${SERVER_PASS} ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_HOST} "

# do db backup
cd ${SERVER_APP_ROOT_PATH};
mongodump --db ${SERVER_MONGO_DBNAME};
echo 'Databases have been backed-up';

# stop the app;
mkdir ${SERVER_APP_ROOT_PATH}/${SERVER_APP_DIR_NAME};
cd ${SERVER_APP_ROOT_PATH}/${SERVER_APP_DIR_NAME};
forever stop $APP_NAME;
echo 'Stopped app from running';

# unpack;
cd $SERVER_APP_ROOT_PATH;
tar -xzvf ${APP_NAME}.tar.gz -C ${SERVER_APP_DIR_NAME};
echo 'Bundle unpacked';

# reinstall packages;
cd ${SERVER_APP_DIR_NAME}/bundle/programs/server/;
npm uninstall;
npm install;
echo 'NPM Packages re-installed';

# start;
cd ${SERVER_APP_ROOT_PATH}/${SERVER_APP_DIR_NAME}/bundle;
export MONGO_URL=mongodb://${SERVER_MONGO_HOST}:${SERVER_MONGO_PORT}/${SERVER_MONGO_DBNAME};
export PORT=$SERVER_PORT;
export ROOT_URL=$SERVER_ROOT_URL;
forever start --uid '${APP_NAME}' -a ./main.js;

# end;
echo 'If no error, ${APP_NAME} deployed and running on:';
echo 'App started. Exiting server...';"

$SHELL