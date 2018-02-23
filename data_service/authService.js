var jwt = require('jsonwebtoken'); //documentation: https://github.com/auth0/node-jsonwebtoken
var env = require('./environment');


exports.generateToken = function(user_email, user_id, callback) {
	console.log("\t\t\t authSvc.generateToken: ");
	
	// TODO: catch errors for this...
	//callback({error?}, null);
	var token = jwt.sign( { email: user_email, id : user_id }, 
									env.auth_secret, 
									{ expiresIn: env.jwt_lifespan });
	console.log("\t\t\t token created successfully!");
	callback(null, token);
}

exports.verifyToken = function(user_sent_token, callback) {
	jwt.verify(user_sent_token, env.auth_secret, { maxAge : env.jwt_lifespan }, function(err, decoded) {
		console.log("\t\t\t authSvc.verifyToken: ");
		if (err) {
			console.log("\t\t\t token verification error. ");
			if (err.name == 'TokenExpiredError') {
				callback({'data':"Session Expired. Please Log In Again.", 'status':250}, null);
			}
			else {
				// missing or invalid or malformed signature
				callback({'data':"Bad Token. Please Log In Again.", 'status':250}, null);
			}
		}
		else {
			console.log("\t\t\t token verified successfully. ");
			console.log("\t\t\t Decoded: "+JSON.stringify(decoded));
			callback(null, decoded);
		}
	});
}