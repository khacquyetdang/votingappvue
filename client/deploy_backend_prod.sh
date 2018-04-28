#!/bin/sh

heroku create
git subtree push --prefix server heroku master