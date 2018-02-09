USE dummyDB;

DROP TABLE IF EXISTS user_table;


CREATE TABLE IF NOT EXISTS user_table(
    user_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(64), 
    password VARCHAR(256),
    user_info VARCHAR(64000)
);
