CREATE TABLE user (
  name TEXT NOT NULL,
  email TEXT UNIQUE PRIMARY KEY,
  profile_pic TEXT NOT NULL,
  balance FLOAT,
  password TEXT UNIQUE
);

CREATE TABLE chatgroup (
  group_name TEXT PRIMARY KEY,
  expense FLOAT
);

CREATE TABLE bill (
  bill_id INT PRIMARY KEY,
  bill_name TEXT,
  creator TEXT NOT NULL,
  group_id INT,
  date TEXT,
  amount FLOAT,
  num_splitter INT
);

CREATE TABLE user_group (
  user_email TEXT,
  group_name TEXT,
  PRIMARY KEY (user_email, group_name),
  FOREIGN KEY(user_email) REFERENCES user(email),
  FOREIGN KEY(group_name) REFERENCES chatgroup(group_name)
)