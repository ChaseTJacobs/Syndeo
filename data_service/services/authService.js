var jwt = require('jsonwebtoken'); //documentation: https://github.com/auth0/node-jsonwebtoken
var contracts = require('../contracts');
var env = 	require('../environment');
var logger = require('winston');

/*
	Generate JWT
*/
exports.generateJWT = function(trust_level, creds, callback) {
	// logger.info("authService.generateJWT: trust = %d, creds = %s", trust_level, JSON.stringify(creds));
	// should be creds = {id, email}
	var algo, secret, lifespan = null;
	var JWT_sign_callback = function(err, token) {
		if (err) {
			logger.error("authService.generateJWT(%d): ", trust_level, err);
			callback(contracts.JWT_Generation_Error, null);
		}
		else {
			callback(null, token);
		}
	};
	
	if (trust_level === env.trust_level_PRELIMINARY) {
		creds.u_id = -1; // dummy value
		algo = env.prelim_algo;
		secret = env.prelim_secret;
		lifespan = env.prelim_lifespan / 1000; /*millisec to sec*/
		
		JWT_sign_callback = function(err, token) {
			if (err) {
				logger.error("authService.generateJWT(%d): ", trust_level, err);
				callback(contracts.JWT_Generation_Error, null, null);
			}
			else {
				var i = Math.random() * (token.length - env.email_token_length);
				var trimmed_token = token.substring(i, i + env.email_token_length);
				callback(null, token, { 'email':creds.email, 'token':trimmed_token });
			}
		};
	}
	if (trust_level === env.trust_level_RESTRICTED) {
		creds.u_id = -1; // dummy value
		algo = env.restrict_algo;
		secret = env.restrict_secret;
		lifespan = env.restrict_lifespan / 1000; /*millisec to sec*/
	}
	if (trust_level === env.trust_level_FULL) {
		algo = env.full_algo;
		secret = env.full_secret;
		lifespan = env.full_lifespan;
	}
	
	// logger.info("authService.generateJWT: CREATING level %d token with u_id=%d & email=%s", trust_level, creds.u_id, creds.email);
	token = jwt.sign( 
		{ email: creds.email, u_id: creds.u_id }, 
		secret, 
		{ expiresIn: lifespan, algorithm: algo }, 
		JWT_sign_callback);
}

/*
	Verify JWT
*/
exports.verifyJWT = function(trust_level, user_sent_token, callback) {
	var algo, secret, lifespan;
	
	if (trust_level === env.trust_level_PRELIMINARY) {
		algo = env.prelim_algo;
		secret = env.prelim_secret;
		lifespan = env.prelim_lifespan/1000; /*millisec to sec*/
	}
	if (trust_level === env.trust_level_RESTRICTED) {
		algo = env.restric_algo;
		secret = env.restrict_secret;
		lifespan = env.restrict_lifespan/1000; /*millisec to sec*/
	}
	if (trust_level === env.trust_level_FULL) {
		algo = env.full_algo;
		secret = env.full_secret;
		lifespan = env.full_lifespan;
	}
	
	jwt.verify(
		user_sent_token, 
		secret, 
		{ algorithms: algo, maxAge : lifespan }, 
		function(err, decoded) {
		if (err) {
			if (err.name == 'TokenExpiredError') {
				logger.info("authService.verifyJWT: expired token: ", err);
				callback(contracts.JWT_Expiration_Error, null);
			}
			else {
				// missing or invalid or malformed signature
				logger.error("authService.verifyJWT: invalid sig: ", err);
				callback(contracts.JWT_Malformed_Error, null);
			}
		}
		else {
			// logger.info("authService.verifyJWT: DECODED level %d token with u_id=%d & email=%s", trust_level, decoded.u_id, decoded.email);
			callback(null, decoded);
		}
	});
}
