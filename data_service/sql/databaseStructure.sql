USE syndeo_db;

-- Static content
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS activity_types;
DROP TABLE IF EXISTS std_iiscript_Qs;
-- Dynamic Content
-- (order of Drops matters)
DROP TABLE IF EXISTS iiscripts;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS user_module_status;
DROP TABLE IF EXISTS user_iiscript_Qs;
DROP TABLE IF EXISTS quizzes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS email_confirmation_tokens;

CREATE TABLE IF NOT EXISTS users(
	u_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(128) NOT NULL, -- Sensitive
	password VARCHAR(256) NOT NULL, -- Sensitive
	user_info VARCHAR(16384), -- Sensitive
	email_response INT UNSIGNED DEFAULT 0,
	resume_request INT UNSIGNED DEFAULT 0,
	msg_or_call_from INT UNSIGNED DEFAULT 0,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	-- stripe_token VARCHAR(1024), -- Sensitive
	CONSTRAINT user_email_unique UNIQUE(email)
);
CREATE TABLE IF NOT EXISTS modules(
	mod_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	module_name VARCHAR(256) NOT NULL,
	module_number INT UNSIGNED NOT NULL,
	module_description VARCHAR(16384),
	module_content VARCHAR(16384),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT module_name_and_num_unique UNIQUE(module_name, module_number)
);
CREATE TABLE IF NOT EXISTS user_module_status(
	u_mod_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	m_id INT UNSIGNED NOT NULL,
	recommended INT UNSIGNED DEFAULT 0,
	interested INT UNSIGNED,
	completed INT UNSIGNED,
	in_progress INT UNSIGNED,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_module_relationship FOREIGN KEY(u_id) REFERENCES users(u_id),
	CONSTRAINT module_table_relationship FOREIGN KEY(m_id) REFERENCES modules(mod_id)
);
CREATE TABLE IF NOT EXISTS activity_types(
	atype_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	activity_type VARCHAR(128) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT activity_type_unique UNIQUE(activity_type)
);
CREATE TABLE IF NOT EXISTS contacts(
	c_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	fullname VARCHAR(256) NOT NULL,
	firstname VARCHAR(128), -- Sensitive
	lastname VARCHAR(128), -- Sensitive
	organization VARCHAR(128), -- Sensitive
	position VARCHAR(256), -- Sensitive
	email VARCHAR(128), -- Sensitive
	phone VARCHAR(64), -- Sensitive
	url_linkedin VARCHAR(256), -- Sensitive
	mail_address VARCHAR(128), -- Sensitive
	notes VARCHAR(16384),
	other_info VARCHAR(16384), -- Sensitive
	created_milli BIGINT UNSIGNED,
	email_response INT UNSIGNED DEFAULT 0,
	resume_request INT UNSIGNED DEFAULT 0,
	msg_or_call_from INT UNSIGNED DEFAULT 0,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_contact_relationship FOREIGN KEY(u_id) REFERENCES users(u_id)
);
CREATE TABLE IF NOT EXISTS activities(
	a_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	c_id INT UNSIGNED,
	atype_id INT UNSIGNED NOT NULL,
	activity_name VARCHAR(128) NOT NULL,
	event_date BIGINT UNSIGNED,
	notes VARCHAR(4096),
	completed INT UNSIGNED DEFAULT 0,
	location VARCHAR(128),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_activity_relationship FOREIGN KEY(u_id) REFERENCES users(u_id),
	CONSTRAINT contact_activity_relationship FOREIGN KEY(c_id) REFERENCES contacts(c_id),
	CONSTRAINT activity_type_relationship FOREIGN KEY(atype_id) REFERENCES activity_types(atype_id)
);
CREATE TABLE IF NOT EXISTS iiscripts(
	ii_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	c_id INT UNSIGNED NOT NULL,
	text VARCHAR(16384) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_iiscript_relationship FOREIGN KEY(u_id) REFERENCES users(u_id),
	CONSTRAINT contact_iiscript_relationship FOREIGN KEY(c_id) REFERENCES contacts(c_id)
);
CREATE TABLE IF NOT EXISTS quizzes(
	qz_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	text VARCHAR(16384) NOT NULL,
	CONSTRAINT user_quiz_relationship FOREIGN KEY(u_id) REFERENCES users(u_id)
);
CREATE TABLE IF NOT EXISTS std_iiscript_Qs(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	q_id INT UNSIGNED NOT NULL DEFAULT 0,
	text VARCHAR(2048) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS user_iiscript_Qs(
	q_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	text VARCHAR(2048),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_userIIscriptQ_relationship FOREIGN KEY(u_id) REFERENCES users(u_id)
);
CREATE TABLE IF NOT EXISTS email_confirmation_tokens(
	email VARCHAR(128) NOT NULL PRIMARY KEY, -- Sensitive
	token VARCHAR(64) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT user_email_unique UNIQUE(email)
);