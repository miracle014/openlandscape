#!/bin/bash

docker-compose up -d
docker exec mysql sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --databases OPENLANDSCAPE' > ./build/mysql/mfns.sql
