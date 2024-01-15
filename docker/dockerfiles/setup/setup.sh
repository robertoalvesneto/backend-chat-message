#!/bin/sh

# Check if the directories already exist
if [ -d "${SSL_CERTS_PATH}/postgres" ] || [ -d "${SSL_CERTS_PATH}/mongodb" ] || [ -d "${SSL_CERTS_PATH}/rabbitmq" ] || [ -d "${SSL_CERTS_PATH}/api" ]; then
    echo "One or more directories already exist. Stopping script."
else
    # Create directories for each service's certificates and set appropriate permissions
    mkdir -p "${SSL_CERTS_PATH}/postgres"
    mkdir -p "${SSL_CERTS_PATH}/mongodb"
    mkdir -p "${SSL_CERTS_PATH}/rabbitmq"
    mkdir -p "${SSL_CERTS_PATH}/api"

    # Generate SSL certificates for each service

    # --- NestJS Service -------------------------------------------------------
    openssl genpkey \
        -algorithm EC \
        -pkeyopt ec_paramgen_curve:P-256 \
        -out "${SSL_CERTS_PATH}/api/ca.key"
    
    openssl req \
        -key "${SSL_CERTS_PATH}/api/ca.key" \
        -new  -out "${SSL_CERTS_PATH}/api/ca.csr" \
        -subj "/C=BR/ST=Amazonas/L=Manaus/O=Echo company/CN=localhost"
    
    openssl x509 \
        -signkey "${SSL_CERTS_PATH}/api/ca.key" \
        -in "${SSL_CERTS_PATH}/api/ca.csr" \
        -req -days 365 -out "${SSL_CERTS_PATH}/api/ca.crt"

    # --- PostgreSQL Service ---------------------------------------------------
    openssl genpkey \
        -algorithm EC \
        -pkeyopt ec_paramgen_curve:P-256 \
        -out "${SSL_CERTS_PATH}/postgres/ca.key"

    openssl req \
        -key "${SSL_CERTS_PATH}/postgres/ca.key" \
        -new -out "${SSL_CERTS_PATH}/postgres/ca.csr" \
        -subj "/C=BR/ST=Amazonas/L=Manaus/O=Echo company/CN=localhost"
    
    openssl x509 \
        -signkey "${SSL_CERTS_PATH}/postgres/ca.key" \
        -in "${SSL_CERTS_PATH}/postgres/ca.csr" \
        -req -days 365 -out "${SSL_CERTS_PATH}/postgres/ca.crt"

    # --- MongoDB Service ------------------------------------------------------
    openssl genpkey \
        -algorithm EC \
        -pkeyopt ec_paramgen_curve:P-256 \
        -out "${SSL_CERTS_PATH}/mongodb/ca.key"

    openssl req \
        -key "${SSL_CERTS_PATH}/mongodb/ca.key" \
        -new -out "${SSL_CERTS_PATH}/mongodb/ca.csr" \
        -subj "/C=BR/ST=Amazonas/L=Manaus/O=Echo company/CN=localhost"
    
    openssl x509 \
        -signkey "${SSL_CERTS_PATH}/mongodb/ca.key" \
        -in "${SSL_CERTS_PATH}/mongodb/ca.csr" \
        -req -days 365 -out "${SSL_CERTS_PATH}/mongodb/ca.crt"

    # --- RabbitMQ Service -----------------------------------------------------
    openssl genpkey \
        -algorithm EC \
        -pkeyopt ec_paramgen_curve:P-256 \
        -out "${SSL_CERTS_PATH}/rabbitmq/ca.key"

    openssl req \
        -key "${SSL_CERTS_PATH}/rabbitmq/ca.key" \
        -new -out "${SSL_CERTS_PATH}/rabbitmq/ca.csr" \
        -subj "/C=BR/ST=Amazonas/L=Manaus/O=Echo company/CN=localhost"
    
    openssl x509 \
        -signkey "${SSL_CERTS_PATH}/rabbitmq/ca.key" \
        -in "${SSL_CERTS_PATH}/rabbitmq/ca.csr" \
        -req -days 365 -out "${SSL_CERTS_PATH}/rabbitmq/ca.crt"

    cat "${SSL_CERTS_PATH}/api/ca.crt" "${SSL_CERTS_PATH}/postgres/ca.crt" "${SSL_CERTS_PATH}/mongodb/ca.crt" "${SSL_CERTS_PATH}/rabbitmq/ca.crt" > "${SSL_CERTS_PATH}/ca_with_public_keys.crt"

    chown -R root:root "${SSL_CERTS_PATH}";
    find "${SSL_CERTS_PATH}" -type d -exec chmod 755 {} \;
    find "${SSL_CERTS_PATH}" -type f -exec chmod 644 {} \;
fi

echo "all done"
