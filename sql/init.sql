CREATE TABLE IF NOT EXISTS "user" (
  email VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type INT NOT NULL
);

CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  owner_email VARCHAR(255),
  file_type VARCHAR(255),
  status INT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (current_timestamp AT TIME ZONE 'UTC')
);

CREATE TABLE IF NOT EXISTS tag (
  media_id INT REFERENCES media (id),
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS album (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS album_media (
  album_id INT NOT NULL,
  media_id INT NOT NULL
);
