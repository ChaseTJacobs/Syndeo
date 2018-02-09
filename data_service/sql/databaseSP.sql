USE dummyDB;
select '...procedure definitions...' AS '';



select '...procedure create - addUser' AS '';
DROP PROCEDURE IF EXISTS addUser;
DELIMITER //
CREATE PROCEDURE addUser(IN pEmail VARCHAR(64), uPass VARCHAR(64), pUserInfo VARCHAR(64000))
BEGIN
   INSERT INTO user_table(email, password, user_info) VALUES(pEmail, uPass, pUserInfo); 
   SELECT user_id, email FROM user_table WHERE email = pEmail AND password = uPass;
END //
DELIMITER ;



select '...procedure create - isUserInDatabase' AS '';
DROP PROCEDURE IF EXISTS isUserInDatabase;
DELIMITER //
CREATE PROCEDURE isUserInDatabase(IN pEmail VARCHAR(64))
BEGIN
   SELECT * FROM user_table WHERE email = pEmail;
-- SELECT user_id, email FROM user_table WHERE email = pEmail AND password = uPass;
END //
DELIMITER ;



select '...procedure create - getUserInfo' AS '';
-- getUserInfo returns the JSON formatted string of all the user's info
DROP PROCEDURE IF EXISTS getUserInfo;
DELIMITER //
CREATE PROCEDURE getUserInfo(IN pEmail VARCHAR(64), uPass VARCHAR(256))
BEGIN
    SELECT user_info FROM user_table WHERE email = pEmail AND password = uPass;
END //
DELIMITER ;



select '...procedure create - updateUserInfo_procedure' AS '';
DROP PROCEDURE IF EXISTS updateUserInfo_procedure;
DELIMITER //
CREATE PROCEDURE updateUserInfo_procedure(IN pEmail VARCHAR(64), uPass VARCHAR(64), pUserInfo VARCHAR(64000))
BEGIN
	UPDATE user_table SET user_info = pUserInfo WHERE email = pEmail AND password = uPass;
END//
DELIMITER ;
