var db = require("./dbService");
var authService = 	require('./authService');
// var cryptoUtil = require("./cryptoUtil");

/* Log In:
	1) validate user info
	1.5) Encrypt data
	2) check user actually exists
	3) generate JWT
*/
exports.login = function(reqBody, callback){
	console.log("\t\t IN acctSvc.login: ");
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
					
					if(err) {
						// TODO: Test this isn't just a 'user not found' scenario.
						console.log("\t\t DB err:  "+err);
						callback(true, {'data':"some kind of DB error occurred", 'status':251}, null);
					}
					else {
						console.log("\t\t \'isUserInDatabase\' query result: "+JSON.stringify(queryResult));//queryResult);//
						
						if (qr[0].length == 0 /* empty set */) {
							// queryResult is the empty set. Email not in DB. do not generate JWT
							console.log("\t\t requested email \'"+reqBody.email+"\' does not exist.");
							callback(true, {'data':"Incorrect Username or Password.", 'status':250}, null);
						}
						else {
							if ( !(queryResult["password"] === reqBody.pass /* TODO: compare passwords */)) {
								console.log("\t\t submitted password \'"+reqBody.pass+"\' != "+queryResult["password"]);
								callback(true, {'data':"Incorrect Username or Password.", 'status':250}, null);
							}
							else if (false /* do something with queryResult["expiry_date"] */) {
								// TODO: check account expiry date
								// callback(true, {'data':"Account has expired due to non-payment", 'status':250}, null);
							}
							else { 
								user_email = queryResult["email"];//reqBody.email;
								user_id = queryResult["user_id"];//77;
								
								// 3 - generate JWT
								authService.generateToken(user_email, user_id, function(err, token) {
									if (err) {
										console.log("\t\t something went wrong with JWT generation...");
										callback(true, {'data':"something went wrong with JWT generation", 'status':252}, null);
									}
									else {
										console.log("\t\t Successful Login. Sending user_info: "+queryResult["user_info"]);
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
	console.log("\t\t IN acctSvc.createAccount: ");

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
					
					if(err) {
						console.log("\t\t DB err:  "+err);
						callback(true, " something went wrong... ", null);
					}
					else {
						console.log("\t\t \'isUserInDatabase\' query result: "+JSON.stringify(queryResult));//queryResult);//
						
						if (qr[0].length > 0) {
							// Email already in use in DB
							console.log("\t\t requested email \'"+reqBody.email+"\' already in DB.");
							callback(true, {'data':"an account already exists in connection with this email", 'status':250}, null);
						}
						else {
							var userInfo = JSON.stringify(reqBody.userInfo);
							// TODO: create an expiry date for the account
							
							// addUser inserts new user, then returns userId and email for the JWT
							db.query("Call addUser(?,?,?)",
										[reqBody.email, reqBody.pass, userInfo],
										function (error, queryRes) {
											queryResult = queryRes[0][0];
											console.log("\t\t \'addUser\' query result: "+JSON.stringify(queryResult));
											
											if(error) {
												console.log("\t\t DB err:  "+error);
												callback(true, " something went wrong... ", null);
											}
											else { 
												user_email = queryResult["email"];
												user_id = queryResult["user_id"];
												
												// 3 - generate JWT
												authService.generateToken(user_email, user_id, function(err, token) {
													if (err) {
														console.log("\t\t something went wrong with JWT generation...");
														callback(true, "something went wrong with JWT generation...", null);
													}
													else {
														console.log("\t\t Successful Registration. Sending user_info: "+queryResult["user_info"]);
														callback(false, queryResult["user_info"], token);
													}
												});								
											}
										});
						}
					}
				});
}

