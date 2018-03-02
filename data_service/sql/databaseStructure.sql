USE syndeo_db;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS global_counters;
DROP TABLE IF EXISTS modules;
DROP TABLE IF EXISTS user_module_status;
DROP TABLE IF EXISTS activity_types;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS std_iiscript_Qs;
DROP TABLE IF EXISTS user_iiscript_Qs;
DROP TABLE IF EXISTS iiscripts;
DROP TABLE IF EXISTS quizzes;

CREATE TABLE IF NOT EXISTS users(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(128) NOT NULL, 
	password VARCHAR(256) NOT NULL,
	user_info VARCHAR(16384),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	stripe_token VARCHAR(1024),
	CONSTRAINT user_email_unique UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS global_counters(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	email_response INT UNSIGNED DEFAULT 0,
	resume_request INT UNSIGNED DEFAULT 0,
	msg_or_call INT UNSIGNED DEFAULT 0,
	CONSTRAINT user_gcounter_relationship FOREIGN KEY(u_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS modules(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	module_name VARCHAR(256) NOT NULL,
	module_number INT UNSIGNED NOT NULL,
	module_content VARCHAR(16384),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT module_name_and_num_unique UNIQUE(module_name, module_number)
);

CREATE TABLE IF NOT EXISTS user_module_status(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	m_id INT UNSIGNED NOT NULL,
	recommended INT UNSIGNED DEFAULT 0,
	interested INT UNSIGNED,
	completed INT UNSIGNED,
	in_progress INT UNSIGNED,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_module_relationship FOREIGN KEY(u_id) REFERENCES users(id),
	CONSTRAINT module_table_relationship FOREIGN KEY(m_id) REFERENCES modules(id)
);

CREATE TABLE IF NOT EXISTS activity_types(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	activity_type VARCHAR(128) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT activity_type_unique UNIQUE(activity_type)
);

CREATE TABLE IF NOT EXISTS contacts(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	fullname VARCHAR(256) NOT NULL,
	firstname VARCHAR(128),
	lastname VARCHAR(128),
	organization VARCHAR(128),
	position VARCHAR(256),
	email VARCHAR(128),
	phone VARCHAR(64),
	url_linkedin VARCHAR(256),
	mail_address VARCHAR(128),
	notes VARCHAR(16384),
	other_info VARCHAR(16384),
	email_response INT UNSIGNED DEFAULT 0,
	resume_request INT UNSIGNED DEFAULT 0,
	msg_or_call_from INT UNSIGNED DEFAULT 0,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_contact_relationship FOREIGN KEY(u_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS activities(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	c_id INT UNSIGNED,
	a_id INT UNSIGNED NOT NULL,
	name VARCHAR(128) NOT NULL,
	event_date BIGINT UNSIGNED NOT NULL,
	notes VARCHAR(4096),
	completed INT UNSIGNED DEFAULT 0,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_activity_relationship FOREIGN KEY(u_id) REFERENCES users(id),
	CONSTRAINT contact_activity_relationship FOREIGN KEY(c_id) REFERENCES contacts(id),
	CONSTRAINT activity_type_relationship FOREIGN KEY(a_id) REFERENCES activity_types(id)
);
-- for creating iiscripts
CREATE TABLE IF NOT EXISTS std_iiscript_Qs(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	text VARCHAR(2048),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- for creating iiscripts
CREATE TABLE IF NOT EXISTS user_iiscript_Qs(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	text VARCHAR(2048),
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- for saving created iiscripts
CREATE TABLE IF NOT EXISTS iiscripts(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	c_id INT UNSIGNED NOT NULL,
	text VARCHAR(16384) NOT NULL,
	created DATETIME DEFAULT CURRENT_TIMESTAMP,
	updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT user_iiscript_relationship FOREIGN KEY(u_id) REFERENCES users(id),
	CONSTRAINT contact_iiscript_relationship FOREIGN KEY(c_id) REFERENCES contacts(id)
);

CREATE TABLE IF NOT EXISTS quizzes(
	id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	u_id INT UNSIGNED NOT NULL,
	text VARCHAR(16384) NOT NULL,
	CONSTRAINT user_quiz_relationship FOREIGN KEY(u_id) REFERENCES users(id)
);