#!/bin/bash

if [ "$1" != "up:containers" ] && [ "$1" != "down:containers" ]; then
  echo "test.sh (up | down):containers"
else
  if [ "$1" == "up:containers" ]; then
    cp ./back/.env.example ./back/.env
    image=`docker ps -a | grep -o "mongo-chat-app"`
    if [ "" == "$image" ]; then
      docker run --rm --name mongo-chat-app -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=username \
        -e MONGO_INITDB_ROOT_PASSWORD=secret \
        -e MONGO_INITDB_DATABASE=chat-app \
        -d mongo:4.4.1
    fi
    image=`docker ps -a | grep -o "redis-chat-app"`
    if [ "" == "$image" ]; then
      docker run --rm --name redis-chat-app -p 6379:6379 -d redis:6.0.9-alpine
    fi
  fi
  if [ "$1" == "down:containers" ]; then
    docker stop mongo-chat-app redis-chat-app
    rm -f ./back/.env
  fi
fi
