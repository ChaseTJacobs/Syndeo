var jwt = require('jsonwebtoken'); //documentation: https://github.com/auth0/node-jsonwebtoken
var env = require('./environment');


exports.generateToken = function(user_email, user_id, callback) {
	
	console.log("\t\t\t authSvc.generateToken: ");
	console.log("\t\t\t  user email: \""+user_email+"\"");
	console.log("\t\t\t  user id   : \""+user_id+"\"");
	console.log("\t\t\t using SECRET: \""+env.auth_secret+"\"");
	
	// TODO: catch errors for this...
	var token = jwt.sign( { email: user_email, id : user_id }, env.auth_secret);
	
	console.log("\t\t\t generated token: \""+token+"\"");

	callback(null, token);
}

exports.verifyToken = function(user_sent_token, callback) {
	jwt.verify(user_sent_token, env.auth_secret, function(err, decoded) {
		console.log("\t\t\t authSvc.verifyToken: ");
		if (err) {
			callback(err);
			console.log("\t\t\t token verification error. ");
			if (err.name == 'TokenExpiredError') {
				// 
			}
			else if (err.name == 'JsonWebTokenError') {
				// missing or invalid signature
			}
			else {
				// 'jwt malformed' or something else is missing. corrupted or tampered with.
			}
		}
		else {
			console.log("\t\t\t token verified successfully. ");
			console.log("\t\t\t Decoded:\n"+JSON.stringify(decoded));
			callback(null, decoded);
		}
	});
}