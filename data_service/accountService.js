var db = require("./dbService");
var authService = 	require('./authService');
var logger = 			require('winston');

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
						callback(true, {'data':"some kind of DB error occurred", 'status':251}, null);
					}
					else {
						
						if (qr[0].length == 0) {
							// queryResult is the empty set. Email not in DB. do not generate JWT
							logger.warn("accountService.login: user email \'%s\' does not exist", reqBody.email);
							callback(true, {'data':"Incorrect Username or Password.", 'status':250}, null);
						}
						else {
							if ( !(queryResult["password"] === reqBody.pass )) {
								logger.warn("accountService.login: passwords \'%s\' != \'%s\'", reqBody.pass, queryResult["password"] );
								callback(true, {'data':"Incorrect Username or Password.", 'status':250}, null);
							}
							else if (false /* do something with queryResult["expiry_date"] */) {
								// TODO: check account expiry date?
								// callback(true, {'data':"Account has expired due to non-payment", 'status':250}, null);
							}
							else { 
								user_email = queryResult["email"];
								user_id = queryResult["id"];
								
								// 3 - generate JWT
								authService.generateToken(user_email, user_id, function(err, token) {
									if (err) {
										callback(true, {'data':"something went wrong with JWT generation", 'status':252}, null);
									}
									else {
										logger.info("accountService.login: successful login by %s", reqBody.email);
										callback(false, {'data':queryResult["user_info"], 'status':150}, token);
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
	var userInfo = JSON.stringify(reqBody.userInfo);
	db.query("CALL isUserInDatabase(?)", 
				[reqBody.email], 
				function(err, qr){
					var queryResult = {};
					queryResult = qr[0][0];
					
					if(err) {
						logger.error("accountService.createAccount: isUserInDatabase: ", err);
						callback(true, " something went wrong... ", null);
					}
					else {
						// console.log("\t\t \'isUserInDatabase\' query result: "+JSON.stringify(queryResult));//queryResult);//
						
						if (qr[0].length > 0) {
							// Email already in use in DB
							logger.warn("accountService.createAccount: user email \'%s\' already in use", reqBody.email);
							callback(true, {'data':"an account already exists in connection with this email", 'status':250}, null);
						}
						else {
							
							// TODO: Implement Stripe API here ------------------------------------------
							
							// addUser inserts new user, then returns userId and email for the JWT
							// var userInfo = JSON.stringify(reqBody.userInfo); // moved up
							db.query("Call addUser(?,?,?)",
										[reqBody.email, reqBody.pass, userInfo], // stripe_token???
										function (error, queryRes) {
											queryResult = queryRes[0][0];
											// console.log("\t\t \'addUser\' query result: "+JSON.stringify(queryResult));
											
											if(error) {
												logger.error("accountService.createAccount: addUser: ", error);
												callback(true, " something went wrong... ", null);
											}
											else { 
												user_email = queryResult["email"];
												user_id = queryResult["id"];
												
												// 3 - generate JWT
												authService.generateToken(user_email, user_id, function(err, token) {
													if (err) {
														callback(true, "something went wrong with JWT generation...", null);
													}
													else {
														logger.info("accountService.createAccount: created account for %s", reqBody.email);
														callback(false, queryResult["user_info"], token);
													}
												});								
											}
										});
						}
					}
				});
}

