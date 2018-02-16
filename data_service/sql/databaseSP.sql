USE dummyDB;
select '...procedure definitions...' AS '';


select '...procedure create - addUser' AS '';
DROP PROCEDURE IF EXISTS addUser;
DELIMITER //
CREATE PROCEDURE addUser(IN pEmail VARCHAR(64), uPass VARCHAR(64), pUserInfo VARCHAR(64000))
BEGIN
   INSERT INTO user_table(email, password, user_info) VALUES(pEmail, uPass, pUserInfo); 
   SELECT * FROM user_table WHERE email = pEmail AND password = uPass;
END //
DELIMITER ;


select '...procedure create - isUserInDatabase' AS '';
DROP PROCEDURE IF EXISTS isUserInDatabase;
DELIMITER //
CREATE PROCEDURE isUserInDatabase(IN pEmail VARCHAR(64))
BEGIN
   SELECT * FROM user_table WHERE email = pEmail;
END //
DELIMITER ;

