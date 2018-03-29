USE syndeo_db;

-- Static Content
INSERT INTO activity_types(activity_type) VALUES("Send Email");
INSERT INTO activity_types(activity_type) VALUES("Informational Interview");
INSERT INTO activity_types(activity_type) VALUES("Phone Call");
INSERT INTO activity_types(activity_type) VALUES("Meeting");
INSERT INTO activity_types(activity_type) VALUES("Interview");
INSERT INTO activity_types(activity_type) VALUES("Other");

INSERT INTO std_iiscript_Qs(text) VALUES("Have you ever murdered someone?");
INSERT INTO std_iiscript_Qs(text) VALUES("How many people have you murdered?");
INSERT INTO std_iiscript_Qs(text) VALUES("Will you please not murder me?");

INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Non-Badly", 1, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Okayly", 2, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Goodly", 3, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Betterly", 4, "Lorem Ipsum Doodle Diddle Dee.");
INSERT INTO modules(module_name, module_number, module_content) VALUES("Doing Things Bestly", 5, "Lorem Ipsum Doodle Diddle Dee.");

-- Test User Content
CALL addUser("nathanulmer@gmail.com", "asdf", "{\"firstname\":\"Nathan\", \"lastname\":\"Ulmer\"}");
CALL addUser("chase@email.com", "test", "{\"quizResults\":[2,1,0,1,0,0,0,1]}");
CALL addUser("kim@email.com", "Pass", "KIMMY DEEEEAAAAN!!!!");

CALL newContact(1, "Zoe Barton", "Zoe", "Barton", "Walmart", "Recruiter", NULL, NULL, NULL, NULL, NULL, NULL, NULL);
CALL newContact(1, "Bill Smarterman", "Bill", "Smarterman", "Walmart", "Developer", NULL, NULL, NULL, NULL, NULL, NULL, NULL);
CALL newContact(1, "Mr. J J", "Mr. J", "J", "Walmart", "Bossman", NULL, NULL, NULL, NULL, NULL, NULL, NULL);

CALL newContact(2, "Nate Ulmer", "Nate", "Ulmer", "Walmart Labs", "Junior Developer", "nate@email.com", "903-272-0225", "linkedin.com/nateulmer", "5 Pioneer Road #311, Rexburg ID 83440", "Met Nate my freshman year of college. Ended up moving in with him the next year. We were both hired on by Maura Software in 2015, and also became neighbors after we both got married. Interned for Walmart in 2017 and got a full time job offer, to start in April 2018.", "[]", 1521220544601);
CALL newContact(2, "Kim Dean", "Kim", "Dean", "LDS Church", "Junior Developer", "kim@email.com", "801-560-7296", "linkedin.com/kim_dean", "151 W 4th S 208, Rexburg ID 83440", "Met Kim in Software Engineering 1 (CS364), and kept in contact. I asked her to help with my senior project and she accepted. And she's just an all-around awesome gal.", "[]", 1521220544602);
CALL newContact(2, "James Crook", "James", "Crook", "Joyful Networking", "CEO", "james@email.com", "801-245-9030", "linkedin.com/jamescrook", "S 2nd E #415, Rexburg ID 83440", "James is the CEO of Joyful Job Search LLC, which also owns part of Joyful Networking LLC. We met through mutual friends of my wife.", "[]", 1521224813515);
CALL newContact(2, "Arturo Aguila", "Arturo", "Aguila", "Melaluca", "Junior Developer", "agu09001@byui.edu", "661-373-9209", "linkedin.com/artaguila", "22934 Cerca Drive", "Used to work at Melaluca, and has contacts there. Trying to get a job with USAA. Graduating in April 2018.", "[]", 1521649714583);
CALL newContact(2, "Drew Eagar", "Drew", "Eagar", "BYU-Idaho", "Marketing Department Chair", "eagard@byui.edu", "555-555-5555", "http://www.byui.edu/business-management/faculty/drew-eagar", "N/A", "Cool guy!", "[]", 1521826455072);

CALL newContact(3, "Kimberly Dean", "Kimberly", "Dean", NULL, "Boss", "kimberly.morgan39@gmail.com", "18015607296", "kim@linkedin.com", "151 W 4th S apt 208", "Kim Rox. Kim is the extra most bestest.", "[]", 1521828774255);


CALL newActivity(1, 1, 3, "Hangin Out", 1000000, "notes about this meeting.....", NULL, NULL);
CALL newActivity(1, 2, 1, "Bizznass", 1000002, "gonna crush this", NULL, NULL);
CALL newActivity(1, 2, 2, "Mo Bizznass", 1000003, "dont hurt my chiuaua!", NULL, NULL);

CALL newActivity(2, 4, 2, "Informational Interview", 1522440000000, "Test Activity", NULL, NULL);
CALL newActivity(2, 4, 3, "Phone Call", 1518752700000, "Test Activity", NULL, NULL);
CALL newActivity(2, 4, 3, "Phone Call", 1521848400000, "Test Activity", NULL, NULL);
CALL newActivity(2, 4, 1, "Send Email", 1521784800000, "Test Activity", NULL, NULL);
CALL newActivity(2, 4, 5, "Interview", 1524531900000, "Test Activity", NULL, NULL);
CALL newActivity(2, 4, 6, "Test Activity", 1525154400000, "This is different", NULL, NULL);
CALL newActivity(2, 4, 1, "Send Email", 1524502800000, "Test Activity", NULL, NULL);
CALL newActivity(2, 7, 1, "Send Email", 1524498600000, "Follow up with previous email.", NULL, NULL);
CALL newActivity(2, 7, 3, "Phone Call", 1524542400000, "Call asking about previous email.", NULL, NULL);
CALL newActivity(2, 7, 1, "Send Email", 1523080800000, "Ask art about his ties with Melaluca", NULL, NULL);
CALL newActivity(2, 7, 1, "Send Email", 1519974000000, "Follow up introduction email with questions about past work activities.", NULL, NULL);
CALL newActivity(2, 7, 1, "Send Email", 1514876400000, "Send introduction email.", NULL, NULL);
CALL newActivity(2, 6, 4, "Meeting", 1521831600000, "Meeting with Head of Marketing Department. Formal Dress :(", NULL, NULL);
CALL newActivity(2, 9, 6, "Coffee Meeting", 1522533600000, "Here we go!", NULL, NULL);

CALL newIIscript(1, 2, "This could\nBe one flipping\nHuge blob of text.\nBut its\nNot.");

