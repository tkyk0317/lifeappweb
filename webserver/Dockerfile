FROM ubuntu:14.04

RUN ["apt-get", "update"]
RUN ["apt-get", "-y", "install", "nginx"]

# forward request and error logs to docker log collector
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
VOLUME ["/var/cache/nginx"]
EXPOSE 80 443

# load nginx conf as root
ADD ./site.conf /etc/nginx/sites-available/lifeapp
RUN ["ln", "-s", "/etc/nginx/sites-available/lifeapp", "/etc/nginx/sites-enabled/lifeapp"]
RUN ["rm", "-rf", "/etc/nginx/sites-available/default"]

# add application code as unprivileged user
RUN ["groupadd", "webserver"]
RUN ["useradd", "webserver", "-s", "/bin/bash", "-m", "-g", "webserver", "-G", "webserver"]
ENV HOME /home/webserver
WORKDIR /home/webserver
RUN ["chown", "-R", "webserver:webserver", "/home/webserver"]

#start the server
CMD ["nginx", "-g", "daemon off;"]
