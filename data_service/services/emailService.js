var db = require("./dbService");
var authService = require('./authService');
var env = 	require('../environment');
var contracts = require('../contracts');
var logger = require('winston');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(env.sendGrid_API_key);
/*
	We'll be sending emails for forgotten passwords, payment confirmations, and successful registration.
*/


exports.confirmEmail = function(user_sent_token, reqBody, callback){
	authService.verifyJWT(env.trust_level_PRELIMINARY, user_sent_token, function(err1, decoded){
		if (err1) {
			callback(true, err1, null);
		}
		else if (!(decoded.email === reqBody.email)) {
			logger.error("emailService.confirmEmail: EMAIL SWAP - %s != %s", decoded.email, reqBody.email);
			callback(true, contracts.EmailSwap_Error, null);
		}
		else {
			db.query("CALL validateEmailToken(?,?)", [decoded.email, reqBody.token], function(err2, qr2){
				if (err2) {
					logger.error("emailService.confirmEmail: validateEmailToken(sql): ", err2);
					callback(true, contracts.DB_Access_Error, null);
				}
				else {
					if (qr2.affectedRows < 1) {
						logger.warn("emailService.confirmEmail: failed to validate token = %s for email = %s", reqBody.token, decoded.email);
						callback(true, contracts.EmailConfirm_Failure, null);
					}
					else { // Success!
						authService.generateJWT(env.trust_level_RESTRICTED, {'email':decoded.email}, function(err3, jwtoken){
							if (err3) {
								callback(true, err3, null);
							}
							else {
								logger.info("emailService.confirmEmail: email \'%s\' confirmed :) ", decoded.email);
								callback(false, contracts.EmailConfirmed, jwtoken);
							}
						});
					}
				}});
		}
	});
}


exports.emailToken = function(reqBody, callback){
	/*
		1  generate JWT & 8-char token  
		2	store token
		3	email token to the client and expiration time.
		4	send PRELIMINARY JWT
	*/
	authService.generateJWT(env.trust_level_PRELIMINARY, {'email':reqBody.email}, function(err1, jwtoken, candidate) {
		if (err1) {
			callback(true, err1, null);
		}
		else {
			// TODO: check if email is already in use?
			db.query("CALL createEmailToken(?,?)", [candidate.email, candidate.token], function(err2, qr2){
				if (err2) {
					logger.error("emailService.emailToken: createEmailToken(sql): ", err2);
					callback(true, contracts.DB_Access_Error, null);
				}
				else {
					if (qr2.affectedRows < 1) {
						logger.warn("emailService.emailToken: failed to store recovery token for email %s", candidate.email);
						callback(true, contracts.DB_Access_Error, null);
						// not sure what else it could be...
					}
					else {
						const msg = {
							'to': candidate.email,
							'from': env.sender_email,
							'subject': 'Joyful Networking - email confirmation token',
							'text': 'email confirmation token',
							'html': '<p>here\'s your token:</p> <h1>'+candidate.token+'</h1>',
						};
						sgMail.send(msg);
						logger.info("emailService.emailToken: sending token = %s to email = %s", candidate.token, candidate.email);
						callback(false, contracts.TokenSent, jwtoken);
					}
				}});
		}});
}


exports.emailMessage = function(addr, message) {
	logger.info("emailService.emailMessage: email = %s", addr);
	
	const msg = {
	  'to': addr,
	  'from': env.sender_email,
	  'subject': message.subject,
	  'text': 'message from Joyful Networking',
	  'html': message.html,
	};
	sgMail.send(msg);
	
	// callback(); // send any errors???
}