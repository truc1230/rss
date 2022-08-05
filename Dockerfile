FROM node:latest

MAINTAINER trungnd <trungnd@nami.trade>

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install docker-compose

# Create app directory
RUN mkdir -p /sources/web
WORKDIR /sources/web

# Install yarn
# RUN npm install -g yarn

# Install module
# ADD package.json /sources/api/package.json
COPY package.json /sources/web
COPY . /sources/web
RUN yarn

# COPY . /sources/web

# Bundle app source
RUN yarn build

# EXPOSE 3000

CMD ["yarn","start"]
