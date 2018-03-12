USE syndeo_db;
select '...procedure definitions...' AS '';


select '...procedure create - addUser' AS '';
DROP PROCEDURE IF EXISTS addUser;
DELIMITER //
CREATE PROCEDURE addUser(IN pEmail VARCHAR(64), uPass VARCHAR(64), pUserInfo VARCHAR(64000))
BEGIN
   INSERT INTO users(email, password, user_info) VALUES(pEmail, uPass, pUserInfo); 
   SELECT * FROM users WHERE email = pEmail AND password = uPass;
END //
DELIMITER ;


select '...procedure create - isUserInDatabase' AS '';
DROP PROCEDURE IF EXISTS isUserInDatabase;
DELIMITER //
CREATE PROCEDURE isUserInDatabase(IN u_email VARCHAR(64))
BEGIN
   SELECT * FROM users WHERE email = u_email;
END //
DELIMITER ;


select '...procedure create - getAllContacts' AS '';
DROP PROCEDURE IF EXISTS getAllContacts;
DELIMITER //
CREATE PROCEDURE getAllContacts(IN user_id INT UNSIGNED)
BEGIN
   SELECT c_id, firstname, lastname, organization, created FROM contacts WHERE contacts.u_id = user_id;
END //
DELIMITER ;


select '...procedure create - getContactInfo' AS '';
DROP PROCEDURE IF EXISTS getContactInfo;
DELIMITER //
CREATE PROCEDURE getContactInfo(IN user_id INT UNSIGNED, cont_id INT UNSIGNED)
BEGIN
   SELECT * FROM contacts WHERE contacts.u_id = user_id and contacts.c_id = cont_id;
END //
DELIMITER ;


select '...procedure create - newContact' AS '';
DROP PROCEDURE IF EXISTS newContact;
DELIMITER //
CREATE PROCEDURE newContact(IN   user_id INT UNSIGNED,
											full_name VARCHAR(256),
											first_name VARCHAR(128),
											last_name VARCHAR(128),
											org VARCHAR(128),
											job VARCHAR(256),
											c_email VARCHAR(128),
											c_phone VARCHAR(64),
											linkedin VARCHAR(256),
											address VARCHAR(128),
											u_notes VARCHAR(16384),
											other VARCHAR(16384),
											created BIGINT UNSIGNED)
BEGIN
	INSERT INTO contacts(u_id, fullname, firstname, lastname, organization, position, email, phone, url_linkedin, mail_address, notes, other_info, created_milli)
	VALUES(user_id, full_name, first_name, last_name, org, job, c_email, c_phone, linkedin, address, u_notes, other, created);
	-- Ideally you'd return a new list of contacts that includes the new one. But we'll let the client request that explicitly.
END //
DELIMITER ;


select '...procedure create - updateContact' AS '';
DROP PROCEDURE IF EXISTS updateContact;
DELIMITER //
CREATE PROCEDURE updateContact(IN   user_id INT UNSIGNED,
												c_id INT UNSIGNED,
												first_name VARCHAR(128),
												last_name VARCHAR(128),
												org VARCHAR(128),
												job VARCHAR(256),
												c_email VARCHAR(128),
												c_phone VARCHAR(64),
												linkedin VARCHAR(256),
												address VARCHAR(128),
												u_notes VARCHAR(16384),
												other VARCHAR(16384))
BEGIN
	-- UPDATE contacts 
	-- SET	firstname = first_name, lastname = last_name, 
			-- organization = org, position = job, 
			-- email = c_email, phone = c_phone, 
			-- url_linkedin = linkedin, mail_address = address, 
			-- notes = u_notes, other_info = other
	-- WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	
	IF first_name IS NOT NULL THEN
		UPDATE contacts SET firstname = first_name
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF last_name IS NOT NULL THEN
		UPDATE contacts SET lastname = last_name
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF org IS NOT NULL THEN
		UPDATE contacts SET organization = org
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF job IS NOT NULL THEN
		UPDATE contacts SET position = job
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF c_email IS NOT NULL THEN
		UPDATE contacts SET email = c_email
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF c_phone IS NOT NULL THEN
		UPDATE contacts SET phone = c_phone
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF linkedin IS NOT NULL THEN
		UPDATE contacts SET url_linkedin = linkedin
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF address IS NOT NULL THEN
		UPDATE contacts SET mail_address = address
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF u_notes IS NOT NULL THEN
		UPDATE contacts SET notes = u_notes
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF other IS NOT NULL THEN
		UPDATE contacts SET other_info = other
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;	
	
	
END //
DELIMITER ;


select '...procedure create - updateContactStats' AS '';
DROP PROCEDURE IF EXISTS updateContactStats;
DELIMITER //
CREATE PROCEDURE updateContactStats(IN user_id INT UNSIGNED, c_id INT UNSIGNED, email_resp INT UNSIGNED, resume_req INT UNSIGNED, msgCall INT UNSIGNED)
BEGIN
	IF email_resp IS NOT NULL THEN
		UPDATE contacts SET email_response = email_resp
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF resume_req IS NOT NULL THEN
		UPDATE contacts SET resume_request = resume_req
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
	IF msgCall IS NOT NULL THEN
		UPDATE contacts SET msg_or_call_from = msgCall
		WHERE user_id = contacts.u_id and c_id = contacts.c_id;
	END IF;
END //
DELIMITER ;