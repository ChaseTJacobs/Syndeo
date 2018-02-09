-- this file should only need to be run once
-- when you fill it out do not push this file
-- insert name of database here
-- the name of the database also needs to be inserted into databaseStructure on line 
-- 2 of file databseStructure
CREATE DATABASE IF NOT EXISTS dummyDB;
-- insert name of database here
USE dummyDB;

-- fill this part out like such
-- GRANT EXECUTE
-- ON <nameOfDatabase>
-- TO '<userName>'@'127.0.0.1' IDENTIFIED BY '<password>';
-- the <userName> and <password> both need to be inserted into 
-- the environment file
GRANT EXECUTE
    ON <>
    TO '<>'@'localhost' IDENTIFIED BY '<>';

