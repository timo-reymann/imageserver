#!/bin/bash

docker build -t timoreymann/imageserver:latest .
docker push timoreymann/imageserver:latest

docker build -t timoreymann/imageserver:$1 .
docker push timoreymann/imageserver:$1