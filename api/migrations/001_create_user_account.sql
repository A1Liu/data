-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS user_account (
  id uuid NOT NULL PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL
);

---- create above / drop below ----

drop table user_account;
