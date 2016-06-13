FROM alpine:3.3
RUN apk add --update --no-cache nodejs
RUN apk add --update --no-cache make gcc g++ python

ADD package.json /tmp/package.json
RUN cd /tmp && npm install --production
RUN mkdir /src && cp -a /tmp/node_modules /src/

ADD . /src
WORKDIR /src

RUN npm build

EXPOSE 80
