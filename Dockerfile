FROM node:8-jessie-slim

# Expose default port
EXPOSE 3000

# Install system updates and libs and create app folder
RUN apt-get update \
    && apt-get install -y build-essential \
        libssl-dev \
        libreadline-dev \
        wget \
        python2.7 \
        imagemagick \
        graphicsmagick \
        libmagick++-dev \
        libmagic-dev

ENV PATH=$PATH:~/opt/bin:~/opt/node/bin:/usr/lib/x86_64-linux-gnu/ImageMagick-6.8.9/bin-Q16
ENV MAGICK_LIMIT_DISK 300M
ENV MAGICK_LIMIT_MEMORY 2G

WORKDIR /app

ADD package.json package.json
RUN npm install --only=production \
    && npm install --only=production -g gm \
    && apt-get remove -y build-essential \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

ADD src/ src/

# Configuration and localImages mount entrypoints
VOLUME ["/app/config.json", "/app/localImages"]

CMD ["npm", "run", "server"]
