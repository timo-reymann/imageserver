imageserver
===

## What is this?
An image processing server for easy resizing and modifying images on the fly

## Requirements
To run it you need GraphicsMagick, ImageMick, Python 2.7 and Node 8+ installed

## How to use?

### Configuration
You can place a config.json in the project directory to customize the configuration of imageserver

```json
{
    "port": 3000,
    "timeout": 10000
}
```

### Run with node on host/local machine
```bash
npm install
npm run server
```

### Using docker-compose
```yaml
version: '3.2'
services:
  imageserver:
    image: timoreymann/imageserver
    restart: always
    ports:
      - 3000:3000
    # Optional, if you would like to change some config, 
    # please keep in mind that port changes also affects docker port bindings
    volumes: 
      - /opt/imageserver/config.json:/app/config.json
      # Optional, if you would like to use localImages you can easily mount them into the container,
      # this can be a network share or whatever
      - /opt/imageserver/local:/app/localImages
```

## Technical details
### Under the hood
... it simply downloads the image you would like to process, applies the modifications using GraphicsMagick and returns it back, so you can simply use it in web applications and Co.

## Known Limitations
- Very big files can maybe block the service
- to scale you may consider loadbalancing this service because of nodejs threading model
- Works only with images avaiable to application without authenticating, may be blocked by specific providers

## Whats next?
- [x] Docker Image
- [x] Dummy images
- [x] Support for local images?

## Wanna contribute?
Simply write a ticket or submit a pull request, if you have any problems or questions you can also write me an mail ;)