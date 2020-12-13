FROM node:12-slim

# Expose default port
EXPOSE 3000

# Set to app directory
WORKDIR /app

# Setup dependencies and user
RUN apt-get update \
    && apt-get install -y \
        build-essential \
        libssl-dev \
        libreadline-dev \
        wget \
        python2.7 \
        imagemagick \
        graphicsmagick \
        libmagick++-dev \
        libmagic-dev \
    && groupadd -g 1002 imageserver \
    && useradd -u 1002 --gid 1002 imageserver \
    && mkdir -p /home/imageserver \
    && chown -R imageserver:imageserver \
        /usr/local/lib/node_modules \
        /app \
        /home/imageserver

ENV PATH=$PATH:~/opt/bin:~/opt/node/bin:/usr/lib/x86_64-linux-gnu/ImageMagick-6.8.9/bin-Q16
ENV MAGICK_LIMIT_DISK 300M
ENV MAGICK_LIMIT_MEMORY 1G

RUN apt-get install -y --no-install-recommends \
        gcc \
        make \
        g++ \
    && npm install --only=production -g gm \
    && apt-get remove -y \
        build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

USER imageserver

ADD package.json package.json
RUN npm install --only=production

ADD src/ src/

# Configuration and localImages mount entrypoints
VOLUME ["/app/config.json", "/app/localImages"]

CMD ["npm", "run", "server"]

