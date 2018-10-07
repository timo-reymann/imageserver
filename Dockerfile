FROM node:8.12-alpine
EXPOSE 3000
RUN mkdir /app
ADD . /app/
WORKDIR /app
RUN apk upgrade --update-cache --available \
    && apk add graphicsmagick \
    && apk add imagemagick \
    && npm install \
    && npm install -g gm
CMD ["npm", "run", "server"]
VOLUME ["/app/config.json"]