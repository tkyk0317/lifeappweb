FROM node:7.5.0

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev less vim git

ADD ./ /opt/server/
RUN /bin/cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

WORKDIR /opt/server/
RUN npm install

EXPOSE 3000
