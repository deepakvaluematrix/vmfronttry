#!/bin/bash
if [ ! "$(docker ps -q -f name=vmfront)" ]; then
        cd /home/vmfrontdevops/FrontEnd
        docker-compose up -d
fi