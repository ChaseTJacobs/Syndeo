var db = require("./dbService");
var authService = 	require('./authService');
var logger = 			require('winston');

/* GET CONTACT LIST:
	1) 
	2) 
	3) 
	4) 
*/
exports.getContactList = function(user_sent_token, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			// Query DB for contacts
			db.query("CALL getAllContacts(?)", 
				[decoded_token.id], 
				function(err, qr){
					var queryResult = {};
					queryResult = qr[0];
					
					if(err) {
						logger.error("contactService.getContactList: getAllContacts: ", err);
						callback({'data':err, 'status':250});
					}
					else {
						// console.log("\t\t \'getContactList\' query result: "+JSON.stringify(queryResult));
						callback({'data':queryResult, 'status':150});
					}
			});
		}
	});
}


/* CREATE CONTACT:
	1) 
	2) 
	3) 
	4) 
*/
exports.createContact = function(user_sent_token, req_body, callback){
	console.log("\t\t IN contSrv.createContact: ");
	var fullname = (req_body.fName ? req_body.fName : "") + " " + (req_body.lName ? req_body.lName : "");
	var custom = JSON.stringify(req_body.custom);
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			console.log("\t\t a token auth error happened... ");
			// Any JWT error will require user to log in again.
			callback(error);
		}
		else {
			// Query DB for contacts
			// expected values: (user_id, full_name, first_name, last_name, org, job, c_email, c_phone, linkedin, address, u_notes, other)
			db.query("CALL newContact(?,?,?,?,?,?,?,?,?,?,?,?)", 
				[decoded_token.id, fullname, req_body.fName, req_body.lName, req_body.company, req_body.position, req_body.email, req_body.phone, req_body.linkedIn, req_body.address, req_body.description, custom], 
				function(err, qr){
					var queryResult = {};
					queryResult = qr[0];
					if(err) {
						console.log("\t\t DB err:  "+err);
						callback({'data':err, 'status':250});
					}
					else {
						console.log("\t\t \'createContact\' query result: "+JSON.stringify(queryResult));
						callback({'data':queryResult, 'status':150});
					}
			});
		}
	});
}