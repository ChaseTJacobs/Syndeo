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
							else { 
								user_email = queryResult["email"];//reqBody.email;
								user_id = queryResult["user_id"];//77;
								
								// 3 - generate JWT
								authService.generateToken(user_email, user_id, function(err, token) {
									if (err) {
										// something went wrong with JWT generation...
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
	2) check user doesn't already exist
	3) insert new user into DB
	4) respond to client
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
						// TODO: Test this isn't just a 'user not found' scenario.
						console.log("\t\t DB err:  "+err);
						callback(true, " something went wrong... ", null);
					}
					else {
						console.log("\t\t \'isUserInDatabase\' query result: "+JSON.stringify(queryResult));//queryResult);//
						
						if (qr[0].length > 0) {
							// Email already in use in DB
							console.log("\t\t requested email \'"+reqBody.email+"\' already .");
							callback(true, "Incorrect Username or Password.", null);
						}
						else {
							if ( !(queryResult["password"] === reqBody.pass /* TODO: compare passwords */)) {
								console.log("\t\t submitted password \'"+reqBody.pass+"\' != "+queryResult["password"]);
								callback(true, "Incorrect Username or Password.", null);
							}
							else { 
								user_email = queryResult["email"];//reqBody.email;
								user_id = queryResult["user_id"];//77;
								
								// 3 - generate JWT
								authService.generateToken(user_email, user_id, function(err, token) {
									if (err) {
										// something went wrong with JWT generation...
										console.log("\t\t something went wrong with JWT generation...");
										callback(true, "something went wrong with JWT generation...", null);
									}
									else {
										console.log("\t\t Successful Login. Sending user_info: "+queryResult["user_info"]);
										callback(false, queryResult["user_info"], token);
									}
								});								
							}
						}
					}
				});
}


/* Get User Info:
	1) validate user info
	2) Retrieve user info (or not) from DB
	3) respond to client
*/
exports.getUserInfo = function(reqBody, callback){
	/* 1 - TODO */
	/* 2 */
	console.log("\t\t IN acctSvc.getUserInfo: ");
	
	db.query("CALL getUserInfo(?,?)", 
				[reqBody.username, reqBody.password], 
				function(err, queryResult){
					/* 3 */
					if(err){
						console.log("problems...");
						callback("Unable to retrieve user info :( ");
					}else{
						if(! queryResult[0].length > 0)
							callback("User doesn't exist >:[ ");
						else
							callback(queryResult);//(queryResult[0][0].user_info);
					}
				});
}

