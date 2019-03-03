FROM node:8.12-slim
EXPOSE 3000
RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN apt-get update -y && apt-get upgrade -y \
    && apt-get install graphicsmagick imagemagick python2.7 -y \
    && npm install --only=production \
    && npm install --only=production -g gm
CMD ["npm", "run", "server"]
VOLUME ["/app/config.json", "/app/localImages"]