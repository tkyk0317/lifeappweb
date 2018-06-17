FROM mysql:8.0

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev less vim git

RUN /bin/cp -f /usr/share/zoneinfo/Asia/Tokyo /etc/localtime
ADD ./charset.cnf /etc/mysql/conf.d/
ADD ./timezone.cnf /etc/mysql/conf.d/
ADD ./init.sql /docker-entrypoint-initdb.d
