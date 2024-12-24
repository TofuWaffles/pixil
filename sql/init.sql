CREATE TABLE IF NOT EXISTS users (
  email VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TYPE media_status AS ENUM ('active', 'archived', 'deleted');

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255),
  file_type VARCHAR(255),
  status media_status NOT NULL
);

CREATE TABLE IF NOT EXISTS tag (
  media_id INT REFERENCES media (id),
  name VARCHAR(255) NOT NULL
);
