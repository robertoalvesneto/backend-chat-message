FROM debian:latest

RUN apt-get update && apt-get install -y openssl

ARG SSL_CERTS_PATH
ENV SSL_CERTS_PATH ${SSL_CERTS_PATH}

COPY ./docker/dockerfiles/setup/setup.sh /usr/share/setup.sh

USER root

RUN chmod +x /usr/share/setup.sh

CMD ["/bin/bash", "-c", "/usr/share/setup.sh"]
