FROM alpine:3.3
RUN apk add --update --no-cache nodejs make gcc g++ python

#ADD package.json /tmp/package.json
#RUN cd /tmp && npm install
#RUN mkdir -p /src && cp -a /tmp/node_modules /src/

VOLUME /src
WORKDIR /src

#ADD . /src

EXPOSE 3000
