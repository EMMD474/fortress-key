#!/bin/bash

kill $(lsof -ti :3000)

if [ "$(sudo docker ps -q -f name=fortress-postgres)" ]; then
    sudo docker stop fortress-postgres
fi
