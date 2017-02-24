FROM mysql:8.0

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev less vim git

ADD ./charset.cnf /etc/mysql/conf.d/
ADD ./init.sql /docker-entrypoint-initdb.d
