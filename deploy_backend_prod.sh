#!/bin/bash
# to delete an app heroku apps:destroy --app votingappvue
APPS_HEROKU=$(heroku apps);
#echo $APPS_HEROKU;
WEB=votingappvue
API=votingappvueapi
if [[ "${APPS_HEROKU}" != *$WEB* ]];
then
  echo "create $WEB"
  heroku create $WEB --remote $WEB
fi

if [[ " ${APPS_HEROKU} " !=  *$API* ]];
then
  echo "create  $API"
  heroku create $API --remote $API
fi

echo "end";

: '
heroku create votingappvueapi --remote votingappvueapi
heroku create votingappvue --remote votingappvue
git push heroku master
heroku ps:scale web=1 --remote votingappvue
heroku ps:scale api=1 --remote votingappvueapi
'