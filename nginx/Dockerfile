FROM nginx:latest

RUN apt-get update
RUN apt-get install -y vim less wget

ADD default.conf /etc/nginx/conf.d/default.conf
ADD server.conf /etc/nginx/conf.d/server.conf
ADD gzip.conf /etc/nginx/conf.d/gzip.conf

EXPOSE 80
