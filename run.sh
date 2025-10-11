#!/bin/bash


if [ "$(sudo docker ps -q -f name=fortress-postgres)" ]; then
  pnpm dev
else
  sudo docker start fortress-postgres
fi
