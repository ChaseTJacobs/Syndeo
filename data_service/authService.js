var jwt = require('jsonwebtoken'); //documentation: https://github.com/auth0/node-jsonwebtoken
var env = require('./environment');

var logger = require('winston');



exports.generateToken = function(user_email, user_id, callback) {
	// TODO: catch errors for this...
	//callback({error?}, null);
	var token = jwt.sign( { email: user_email, id : user_id }, 
									env.auth_secret, 
									{ expiresIn: env.jwt_lifespan });

	callback(null, token);
}

exports.verifyToken = function(user_sent_token, callback) {
	jwt.verify(user_sent_token, env.auth_secret, { maxAge : env.jwt_lifespan }, function(err, decoded) {
		if (err) {
			if (err.name == 'TokenExpiredError') {
				logger.info("authService.verifyToken: ", err);
				callback({'data':"Session Expired. Please Log In Again.", 'status':250}, null);
			}
			else {
				// missing or invalid or malformed signature
				logger.warn("authService.verifyToken: ", err);
				callback({'data':"Bad Token. Please Log In Again.", 'status':250}, null);
			}
		}
		else {
			callback(null, decoded);
		}
	});
}