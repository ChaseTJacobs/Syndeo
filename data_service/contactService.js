var db = 				require("./dbService");
var authService = 	require('./authService');
var contracts = 		require('./contracts');
var logger = 			require('winston');


/*
	UPDATE CONTACT STATS:
*/
exports.updateContactStats = function(user_sent_token, req_body, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL updateContact(?,?,?,?,?)", 
				[decoded_token.id, req_body.contactID, req_body.email_response, req_body.resume_request, req_body.msg_or_call_from],
				function(err, qr){
					if(err) {
						logger.error("contactService.updateContactStats: updateContactStats: ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// either that contactID doesn't exist, or it doesn't belong to you.
							logger.warn("contactService.updateContactStats: user, id=%d cannot modify client, id=%d", decoded_token.id, req_body.contactID);
							callback(contracts.Bad_ContactID);
						}
						else {
							logger.info("contactService.updateContactStats: success.");
							callback( contracts.UpdateContStats_Success );
						}
					}
			});
		}
	});
}


/*
	UPDATE CONTACT INFO:
*/
exports.updateContactInfo = function(user_sent_token, req_body, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		var custom = JSON.stringify(req_body.custom);
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL updateContact(?,?,?,?,?,?,?,?,?,?,?,?)", 
				[decoded_token.id, req_body.contactID, req_body.fName, req_body.lName, req_body.company, req_body.position, req_body.email, req_body.phone, req_body.linkedIn, req_body.address, req_body.description, custom],
				function(err, qr){
					if(err) {
						logger.error("contactService.updateContactInfo: updateContact: ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						//logger.info("contactService.updateContactInfo: QR = ", qr);
						if (qr.affectedRows < 1) {
							// either that contactID doesn't exist, or it doesn't belong to you.
							logger.warn("contactService.updateContactInfo: user, id=%d cannot modify client, id=%d", decoded_token.id, req_body.contactID);
							callback(contracts.Bad_ContactID);
						}
						else {
							logger.info("contactService.updateContactInfo: success.");
							callback( contracts.UpdateContInfo_Success );
						}
					}
			});
		}
	});
}

/*
	GET CONTACT INFO:
*/
exports.getContactInfo = function(user_sent_token, req_body, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			// Query DB for contacts
			db.query("CALL getContactInfo(?,?)", 
				[decoded_token.id, req_body.contactID],
				function(err, qr){
					if(err) {
						logger.error("contactService.getContactInfo: getContactInfo: ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							// either that contactID doesn't exist, or it doesn't belong to you.
							logger.warn("contactService.getContactInfo: user, id=%d cannot access client, id=%d", decoded_token.id, req_body.contactID);
							callback(contracts.Bad_ContactID);
						}
						else {
							logger.info("contactService.getContactInfo: success.");//: %s", fullname);
							callback( {'data': {'userInfo':qr[0][0]}, 'status':contracts.GetContInfo_Success} );
						}
					}
			});
		}
	});
}


/* 
	GET CONTACT LIST:
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
						callback(contracts.DB_Access_Error);
					}
					else {
						// console.log("\t\t \'getContactList\' query result: "+JSON.stringify(queryResult));
						callback({'data':queryResult, 'status':contracts.GetList_Success});
					}
			});
		}
	});
}


/* 
	CREATE CONTACT: 
*/
exports.createContact = function(user_sent_token, req_body, callback){
	var fullname = req_body.fName + " " + req_body.lName;
	var custom = JSON.stringify(req_body.custom);
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			// Query DB for contacts
			db.query("CALL newContact(?,?,?,?,?,?,?,?,?,?,?,?,?)", 
				[decoded_token.id, fullname, req_body.fName, req_body.lName, req_body.company, req_body.position, req_body.email, req_body.phone, req_body.linkedIn, req_body.address, req_body.description, custom, req_body.created_milli], 
				function(err, qr){
					// var queryResult = {};
					// queryResult = qr[0];
					if(err) {
						logger.error("contactService.createContact: newContact: ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						logger.info("contactService.createContact: created contact: %s", fullname);
						callback( {'data':"success", 'status':contracts.NewContact_Success} );
					}
			});
		}
	});
}