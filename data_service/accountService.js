var db = require("./dbService");
var authService = 	require('./authService');
var contracts = 		require('./contracts');
var logger = 			require('winston');


exports.getAllCounters = function(user_sent_token, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL getAllCounters(?)", 
				[decoded_token.id],
				function(err, qr){
					if(err) {
						logger.error("accountService.getAllCounters: getAllCounters (sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							logger.warn("accountService.getAllCounters: could not access counters for user, id=%d", decoded_token.id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.getAllCounters: success.");
							callback( {'data': qr[0][0], 'status':contracts.GetAllCounters_Success} );
						}
					}
			});
		}
	});
}


exports.updateGlobalCounters = function(user_sent_token, req_body, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL updateGlobalCounters(?,?,?,?)", 
				[decoded_token.id, req_body.email_response, req_body.resume_request, req_body.msg_or_call_from],
				function(err, qr){
					if(err) {
						logger.error("accountService.updateGlobalCounters: updateGlobalCounters(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							logger.warn("accountService.updateGlobalCounters: could update counters for user, id=%d", decoded_token.id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.updateGlobalCounters: success.");
							callback( contracts.UpdateGcounters_Success );
						}
					}
			});
		}
	});
}


exports.updateUserInfo = function(user_sent_token, req_body, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		var user_info = JSON.stringify(req_body.user_info);
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL updateUserInfo(?,?)", 
				[decoded_token.id, user_info],
				function(err, qr){
					if(err) {
						logger.error("accountService.updateUserInfo: updateUserInfo(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// the security of JWT's means this should never happen...
							logger.warn("accountService.updateUserInfo: could not access user, id=%d", decoded_token.id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.updateUserInfo: success.");
							callback( contracts.UpdateUinfo_Success );
						}
					}
			});
		}
	});
}


exports.getUserInfo = function(user_sent_token, callback){
	authService.verifyToken(user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL getUserInfo(?)", 
				[decoded_token.id],
				function(err, qr){
					if(err) {
						logger.error("accountService.getUserInfo: getUserInfo (sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							// the security of JWT's means this should never happen...
							logger.warn("accountService.getUserInfo: could not access user, id=%d", decoded_token.id);
							// TODO: status code for this...
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.getUserInfo: success.");
							// TODO: status code for this...
							callback( {'data': qr[0][0], 'status':contracts.GetUinfo_Success} );
						}
					}
			});
		}
	});
}


// exports.forgotPassword = function(reqBody, callback){
// }


/* Log In:
	1) validate user info
	1.5) Encrypt data
	2) check user actually exists
	3) generate JWT
*/
exports.login = function(reqBody, callback){
	
	/* 1 
		TODO: any validation of reqBody contents???
			if so, make encryption a callback from that.
	*/
	
	/* 1.5
		TODO: encrypt email, call db.query as callback
	*/
	
	// 2 - check user exists
	db.query("CALL isUserInDatabase(?)", 
				[reqBody.email], 
				function(err, qr){
					var queryResult = {};
					queryResult = qr[0][0];
					// console.log("\t\t \'isUserInDatabase\' query result: "+JSON.stringify(qr));
					
					if(err) {
						// TODO: what would this even be??
						logger.error("accountService.login: isUserInDatabase: ", err);
						callback(true, contracts.DB_Access_Error, null);
					}
					else {
						
						if (qr[0].length == 0) {
							// queryResult is the empty set. Email not in DB. do not generate JWT
							logger.warn("accountService.login: user email \'%s\' does not exist", reqBody.email);
							callback(true, contracts.Bad_Creds, null);
						}
						else {
							if ( !(queryResult["password"] === reqBody.password )) {
								logger.warn("accountService.login: passwords \'%s\' != \'%s\'", reqBody.password, queryResult["password"] );
								callback(true, contracts.Bad_Creds, null);
							}
							else if (false /* do something with queryResult["expiry_date"] */) {
								// TODO: check account expiry date?
								// callback(true, {'data':"Account has expired due to non-payment", 'status':250}, null);
							}
							else { 
								user_email = queryResult["email"];
								user_id = queryResult["u_id"];
								
								// 3 - generate JWT
								authService.generateToken(user_email, user_id, function(err, token) {
									if (err) {
										callback(true, err, null);
									}
									else {
										logger.info("accountService.login: successful login by %s", reqBody.email);
										callback(false, {'data':queryResult["user_info"], 'status':contracts.Login_Success}, token);
									}
								});								
							}
						}
					}
				});
}


/* Create Account:
	1) validate user info
	1.5) encrypt data
	2) check user doesn't already exist
	3) insert new user into DB
	4) generate JWT
*/
exports.createAccount = function(reqBody, callback){
	/* 1 
		TODO: any validation of reqBody contents???
			if so, make encryption a callback from that.
	*/
	
	/* 1.5
		TODO: encrypt email, call db.query as callback
	*/
	
	// 2 - check user exists
	var userInfo = JSON.stringify(reqBody.user_info);
	db.query("CALL isUserInDatabase(?)", 
				[reqBody.email], 
				function(err, qr){
					var queryResult = {};
					queryResult = qr[0][0];
					
					if(err) {
						logger.error("accountService.createAccount: isUserInDatabase: ", err);
						callback(true, contracts.DB_Access_Error, null);
					}
					else {
						// console.log("\t\t \'isUserInDatabase\' query result: "+JSON.stringify(queryResult));//queryResult);//
						
						if (qr[0].length > 0) {
							// Email already in use in DB
							logger.warn("accountService.createAccount: user email \'%s\' already in use", reqBody.email);
							callback(true, contracts.Username_Taken, null);
						}
						else {
							
							// TODO: Implement Stripe API here ------------------------------------------
							
							// addUser inserts new user, then returns userId and email for the JWT
							// var userInfo = JSON.stringify(reqBody.userInfo); // moved up
							db.query("Call addUser(?,?,?)",
										[reqBody.email, reqBody.password, userInfo], // stripe_token???
										function (error, queryRes) {
											queryResult = queryRes[0][0];
											// console.log("\t\t \'addUser\' query result: "+JSON.stringify(queryResult));
											
											if(error) {
												logger.error("accountService.createAccount: addUser: ", error);
												callback(true, contracts.DB_Access_Error, null);
											}
											else { 
												user_email = queryResult["email"];
												user_id = queryResult["u_id"];
												
												// 3 - generate JWT
												authService.generateToken(user_email, user_id, function(err, token) {
													if (err) {
														callback(true, err, null);
													}
													else {
														logger.info("accountService.createAccount: created account for %s", reqBody.email);
														callback(false, {'data':queryResult["user_info"], 'status':contracts.NewAcct_Success}, token);
													}
												});								
											}
										});
						}
					}
				});
}

