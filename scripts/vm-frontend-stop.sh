#!/bin/bash
if [ "$(docker ps -q -f name=vmfront)" ]; then
        cd /home/vmfrontdevops/FrontEnd
        docker-compose down
    if [ ! "$(docker ps -aq -f name=vmfront)" ]; then
        docker rmi valuematrix/vm-frontend
    fi
fi
rm -rf /home/vmfrontdevops/FrontEnd/docker-compose.yml
