CREATE TABLE user (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  profile_pic TEXT NOT NULL,
  balance FLOAT
);

CREATE TABLE chatgroup (
  group_id INT PRIMARY KEY,
  group_name TEXT NOT NULL,
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