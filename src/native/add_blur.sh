#!/bin/bash

if [ -z "$1" ]
then
    echo "Filename is missing"
    echo "Usage: $0 filename.ext";
    exit 1;
else
    convert $1 \( +clone -background black -shadow 600x20+0+0 \) +swap -background none -layers merge +repage $1
fi