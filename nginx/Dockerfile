FROM nginx:latest

RUN apt-get update
RUN apt-get install -y vim less wget
RUN mkdir /var/cache/nginx/cache
RUN mkdir /var/cache/nginx/tmp

ADD nginx.conf /etc/nginx/nginx.conf
ADD default.conf /etc/nginx/conf.d/default.conf
ADD server.conf /etc/nginx/conf.d/server.conf
ADD gzip.conf /etc/nginx/conf.d/gzip.conf
ADD cache.conf /etc/nginx/conf.d/cache.conf

EXPOSE 80
