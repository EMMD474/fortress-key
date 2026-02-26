#!/bin/bash


if [ "$(docker ps -q -f name=fortress-postgres)" ]; then
  pnpm dev
else
  docker start fortress-postgres
  pnpm dev
fi
