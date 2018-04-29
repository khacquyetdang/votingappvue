#!/bin/sh

heroku create votingappvueapi --remote votingappvueapi
heroku create votingappvue --remote votingappvue
git push votingappvueapi master
git push votingappvue master
heroku ps:scale web=1 --remote webserver-app-name
heroku ps:scale api=1 --remote apiserver-app-name