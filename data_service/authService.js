var jwt = 			require('jsonwebtoken'); //documentation: https://github.com/auth0/node-jsonwebtoken
var contracts = 	require('./contracts');
var env = 			require('./environment');

var logger = require('winston');



exports.generateToken = function(user_email, user_id, callback) {
	// TODO: catch errors for this...
	//callback({error?}, null);
	var token = jwt.sign( { email: user_email, id : user_id }, 
									env.auth_secret, 
									{ expiresIn: env.jwt_lifespan },
									function(err, token) {
										if (err) {
											logger.error("authService.generateToken: ", err);
											callback(contracts.JWT_Generation_Error, null);
										}
										else {
											callback(null, token);
										}
									});
}

exports.verifyToken = function(user_sent_token, callback) {
	jwt.verify(user_sent_token, env.auth_secret, { maxAge : env.jwt_lifespan }, function(err, decoded) {
		if (err) {
			if (err.name == 'TokenExpiredError') {
				logger.info("authService.verifyToken: expired token: ", err);
				callback(contracts.JWT_Expiration_Error, null);
			}
			else {
				// missing or invalid or malformed signature
				logger.warn("authService.verifyToken: invalid sig: ", err);
				callback(contracts.JWT_Malformed_Error, null);
			}
		}
		else {
			callback(null, decoded);
		}
	});
}