SET search_path TO echo;

CREATE SCHEMA IF NOT EXISTS echo;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

/* --------------------------------- TABLES --------------------------------- */
CREATE TABLE IF NOT EXISTS "user" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  password VARCHAR(255) NOT NULL
);
