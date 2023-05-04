CREATE TABLE user (
  name TEXT NOT NULL,
  email TEXT UNIQUE PRIMARY KEY,
  profile_pic TEXT,
  balance FLOAT,
  password TEXT UNIQUE
);

CREATE TABLE chatgroup (
  group_name TEXT PRIMARY KEY,
  expense FLOAT
);

CREATE TABLE bill (
  bill_date TEXT PRIMARY KEY,
  creator TEXT NOT NULL,
  group_name TEXT NOT NULL,
  amount FLOAT,
  description TEXT,
  FOREIGN KEY(creator) REFERENCES user(email), 
  FOREIGN KEY(group_name) REFERENCES chatgroup(group_name)
);

CREATE TABLE user_group (
  user_email TEXT,
  group_name TEXT,
  PRIMARY KEY (user_email, group_name),
  FOREIGN KEY(user_email) REFERENCES user(email),
  FOREIGN KEY(group_name) REFERENCES chatgroup(group_name)
)