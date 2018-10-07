imageserver
===

# NOTICE: CURRENTLY UNDER ACTIVE DEVELOPMENT AND NOT SUITABLE FOR ANY USAGE

## What is this?
An image processing server for easy resizing and modifying images on the fly

## Requirements
To run it you need GraphicsMagick and Node 8+ installed

## How to use?
Simply create config.json in the project root directory

```json
{
    "port": 3000,
    "timeout": 10000
}
```

... then simply run npm run server.

## Under the hood
... it simply downloads the image you would like to process, applies the modifications using GraphicsMagick and returns it back, so you can simply use it in web applications and Co.

## Limitations


## Whats next?
Currently working on a docker image to improve usability