var jwt = require('jsonwebtoken'); //documentation: https://github.com/auth0/node-jsonwebtoken
var contracts = require('../contracts');
var env = 	require('../environment');
var logger = require('winston');

/*
	GET JWT PARAMS helper function
	- implements daily key rotation for JWT's
*/
get_jwt_secret = function(utc_time, callback){
	let utc_day = Math.floor(utc_time / 86400000); // # millisec/day
	let secret = "";
	try {
		// secret rotates every day and cycles every n days, n = |secrets|
		// this can be changed at any time.
		secret = env.secrets[utc_day % env.secrets.length];
	} catch (exception) {
		secret = env.default_secret;
		logger.error("authService.get_jwt_secret: failure. using default secret. err = ", exception);
	}
	// logger.info("authService.get_jwt_secret: success. using secret \'%s\'", secret);
	callback(secret);		
}
test_rotation = function(){	
	let date = new Date();
	let today = date.getTime();
	let tomorrow = today + 86400000;
	get_jwt_secret(today, (secret) => console.log("Today uses "+secret));
	get_jwt_secret(tomorrow, (secret) => console.log("Tomorrow uses "+secret));
}

/*
	Generate JWT
*/
exports.generateJWT = function(trust_level, creds, callback) {
	// logger.info("authService.generateJWT: trust = %d, creds = %s", trust_level, JSON.stringify(creds));
	// should be creds = {id, email}
	var algo, /*secret,*/ lifespan = null;
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
		// secret = env.prelim_secret;
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
		// secret = env.restrict_secret;
		lifespan = env.restrict_lifespan / 1000; /*millisec to sec*/
	}
	if (trust_level === env.trust_level_FULL) {
		algo = env.full_algo;
		// secret = env.full_secret;
		lifespan = env.full_lifespan;
	}
	
	// logger.info("authService.generateJWT: CREATING level %d token with u_id=%d & email=%s", trust_level, creds.u_id, creds.email);
	let date = new Date();
	get_jwt_secret(date.getTime(), function(secret){
		token = jwt.sign( 
			{ email: creds.email, u_id: creds.u_id }, 
			secret, 
			{ expiresIn: lifespan, algorithm: algo }, 
			JWT_sign_callback);
	});
}

/*
	Verify JWT
*/
exports.verifyJWT = function(trust_level, user_sent_token, callback) {
	var algo, /*secret,*/ lifespan;
	
	if (trust_level === env.trust_level_PRELIMINARY) {
		algo = env.prelim_algo;
		// secret = env.prelim_secret;
		lifespan = env.prelim_lifespan/1000; /*millisec to sec*/
	}
	if (trust_level === env.trust_level_RESTRICTED) {
		algo = env.restric_algo;
		// secret = env.restrict_secret;
		lifespan = env.restrict_lifespan/1000; /*millisec to sec*/
	}
	if (trust_level === env.trust_level_FULL) {
		algo = env.full_algo;
		// secret = env.full_secret;
		lifespan = env.full_lifespan;
	}
	
	let date = new Date();
	get_jwt_secret(date.getTime(), function(secret){
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
	});
}


