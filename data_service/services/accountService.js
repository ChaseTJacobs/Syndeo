var db = require("./dbService");
var env = 	require('../environment');
var authService = 	require('./authService');
var cipherService = require('./cipherService');
var emailService = 	require('./emailService');
var paymentService = 	require('./paymentService');
var moduleService = 	require('./moduleService');
var contracts = 		require('../contracts');
var logger = 			require('winston');


exports.changePassword = function(user_sent_token, reqBody, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(err, decoded) {
		if (err) {
			callback(error);
		}
		else {
			// using encrypted values.
			db.query("CALL changePassword(?,?,?)", [decoded.u_id, reqBody.old_password, reqBody.new_password], function(err1, qr1){
				if(err1) {
					logger.error("accountService.changePassword: changePassword(sql): ", err1);
					callback(contracts.DB_Access_Error);
				}
				else {
					// logger.info("accountService.changePassword: query result = ", qr1);
					if (qr1.affectedRows < 1) {
						logger.warn("accountService.changePassword: failed to change password for user %d", decoded.u_id);
						callback(contracts.ChangePass_Failure);
					}
					else {
						logger.info("accountService.changePassword: changed password for user %d", decoded.u_id);
						emailService.emailMessage(decoded.email, {'subject':"password changed", 'html':env.changedPassMsg}); // no callback...
						callback(contracts.ChangePass_Success);
					}
				}
			});
		}
	});
}


exports.updateForgotPass = function(user_sent_token, reqBody, callback){
	authService.verifyJWT(env.trust_level_RESTRICTED, user_sent_token, function(err, decoded) {
		if (err) {
			callback(true, err, null);
		}
		else if (!(decoded.email === reqBody.email_plain)) {
			logger.error("accountService.updateForgotPass: EMAIL SWAP - %s != %s", decoded.email, reqBody.email);
			callback(true, contracts.EmailSwap_Error, null);
		}
		else {
			db.query("CALL updateForgotPassword(?,?)", 
				[reqBody.email, reqBody.new_password_plain],
				function(err1, qr1){
					if(err1) {
						logger.error("accountService.updateForgotPass: updateForgotPassword(sql): ", err1);
						callback(true, contracts.DB_Access_Error, null);
					}
					else {
						// logger.info("accountService.updateForgotPass: query result = ", qr1);
						if (qr1.affectedRows < 1 ) {
							logger.warn("accountService.updateForgotPass: failed to update password for %s", decoded.email);
							callback(true, contracts.UpdatePass_Failure, null);
						}
						else {
							authService.generateJWT(env.trust_level_FULL, {'email':decoded.email/*qr1[0][0].email*/, 'u_id':qr1[0][0].u_id}, function(err2, jwtoken){
								if (err2) {
									callback(true, err2, null);
								}
								else {
									logger.info("accountService.updateForgotPass: updated password for %s", qr1[0][0].email);
									callback(false, {'data':qr1[0][0].user_info, 'status':contracts.UpdatePass_Success}, jwtoken); // now they're logged in.
								}
							});
						}
					}
			});
		}
	});
}


exports.getAllCounters = function(user_sent_token, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL getAllCounters(?)", 
				[decoded_token.u_id],
				function(err, qr){
					if(err) {
						logger.error("accountService.getAllCounters: getAllCounters (sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							logger.warn("accountService.getAllCounters: could not access counters for user, id=%d", decoded_token.u_id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.getAllCounters: success.");
							callback( {'data': qr[0][0], 'status':contracts.GetAllCounters_Success} );
						}
					}
			});
		}
	});
}


exports.updateGlobalCounters = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL updateGlobalCounters(?,?,?,?)", 
				[decoded_token.u_id, req_body.email_response, req_body.resume_request, req_body.msg_or_call_from],
				function(err, qr){
					if(err) {
						logger.error("accountService.updateGlobalCounters: updateGlobalCounters(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							logger.warn("accountService.updateGlobalCounters: could update counters for user, id=%d", decoded_token.u_id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.updateGlobalCounters: success.");
							callback( contracts.UpdateGcounters_Success );
						}
					}
			});
		}
	});
}


exports.updateUserInfo = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		var user_info = JSON.stringify(req_body.user_info);
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL updateUserInfo(?,?)", 
				[decoded_token.u_id, user_info],
				function(err, qr){
					if(err) {
						logger.error("accountService.updateUserInfo: updateUserInfo(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// the security of JWT's means this should never happen...
							logger.warn("accountService.updateUserInfo: could not access user, id=%d", decoded_token.u_id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.updateUserInfo: success.");
							callback( contracts.UpdateUinfo_Success );
						}
					}
			});
		}
	});
}


exports.getUserInfo = function(user_sent_token, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL getUserInfo(?)", 
				[decoded_token.u_id],
				function(err, qr){
					if(err) {
						logger.error("accountService.getUserInfo: getUserInfo (sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							// the security of JWT's means this should never happen...
							logger.warn("accountService.getUserInfo: could not access user, id=%d", decoded_token.u_id);
							callback(contracts.Bad_UserID);
						}
						else {
							logger.info("accountService.getUserInfo: success.");
							contracts.egress(
								{'email':qr[0][0].email, 'user_info':qr[0][0].user_info},
								contracts.getUserInfo,
								function(crypt_err1, resp_data){
									if (crypt_err1){
										callback(crypt_err1, null); // failed to decrypt the pii
									}
									else {
										callback({'data':resp_data, 'status':contracts.GetUinfo_Success});
									}
								});
						}
					}
			});
		}
	});
}


exports.login = function(reqBody, callback){
	db.query("CALL login(?,?)", [reqBody.email, reqBody.password], function(err, qr){
		if(err) {
			logger.error("accountService.login: login(sql): ", err);
			callback(true, contracts.DB_Access_Error, null);
		}
		else {
			if (qr[0].length == 0) {
				logger.warn("accountService.login: failed login. Bad creds with email=%s & pass=%s", reqBody.email_plain, reqBody.password_plain);
				callback(true, contracts.Bad_Creds, null);
			}
			else {
				cipherService.decrypt(qr[0][0].email, function(crypt_err1, decrypted_email){
					if (crypt_err1) {
						callback(true, crypt_err1, null);
					} 
					else {
						authService.generateJWT(env.trust_level_FULL, {'email':decrypted_email/*qr[0][0].email*/, 'u_id':qr[0][0].u_id}, function(err, jwtoken) {
							if (err) {
								callback(true, err, null);
							}
							else {
								logger.info("accountService.login: successful login by %s", reqBody.email);
								contracts.egress(
									{'email':qr[0][0].email, 'user_info':qr[0][0].user_info},
									contracts.login,
									function(crypt_err2, resp_data){
										if (crypt_err2){
											callback(true, crypt_err2, null); // failed to decrypt the pii
										}
										else {
											callback(false, {'data':resp_data, 'status':contracts.Login_Success}, jwtoken);
										}
									});
									// moduleService.autoPopulate_userModStatus(qr[0][0].u_id); // move this to createAccount()
							}
						});
					}
				});
			}
		}
	});
}


exports.createAccount = function(user_sent_token, reqBody, callback){
	authService.verifyJWT(env.trust_level_RESTRICTED, user_sent_token, function(err, decoded) {
		if (err) {
			callback(true, err, null);
		}
		else if (!(decoded.email === reqBody.email_plain)) {
			logger.error("accountService.createAccount: EMAIL SWAP - %s != %s", decoded.email, reqBody.email_plain);
			callback(true, contracts.EmailSwap_Error, null);
		}
		else {
			var userInfo = JSON.stringify(reqBody.user_info);
			// comparing encrypted values
			db.query("CALL isUserInDatabase(?)", [reqBody.email], function(err1, qr1){
				if(err1) {
					logger.error("accountService.createAccount: isUserInDatabase(sql): ", err1);
					callback(true, contracts.DB_Access_Error, null);
				}
				else {
					if (qr1[0].length > 0) {
						logger.warn("accountService.createAccount: user email \'%s\' already in use", reqBody.email_plain);
						callback(true, contracts.Username_Taken, null);
					}
					else {
						// Make Payment
						paymentService.make_oneTime_payment(reqBody.email_plain, reqBody.stripe_token, function(pay_err, charge){
							if (pay_err) {
								callback(true, "Stripe Payment Error: "+JSON.stringify(pay_err), null);
							}
							else {
								// here we are storing the encrypted values...
								db.query("Call addUser(?,?,?)", [reqBody.email, reqBody.password, userInfo], function (err2, qr2) {
									if(err2) {
										// here if dbService is busted or constraint fails, right?
										logger.error("accountService.createAccount: addUser: ", err2);
										callback(true, contracts.DB_Access_Error, null);
									}
									else {
										if (qr2.affectedRows < 1 || qr2[0].length < 1) {
											// We should never get here. right?
											logger.warn("accountService.createAccount: FAILED to create account with user email \'%s\'", reqBody.email_plain);
											callback(true, contracts.Username_Taken, null);
										}
										else {
											cipherService.decrypt(qr2[0][0].email, function(crypt_err1, decrypted_email){
												if (crypt_err1) {
													callback(true, crypt_err1, null);
												} 
												else {
													authService.generateJWT(env.trust_level_FULL, {'email':decrypted_email, 'u_id':qr2[0][0].u_id}, function(err3, jwtoken) {
														if (err3) {
															callback(true, err3, null);
														}
														else {
															logger.info("accountService.createAccount: created account for %s", reqBody.email_plain);
															contracts.egress(
																{'email':qr2[0][0].email, 'user_info':qr2[0][0].user_info}, // encrypted values!
																contracts.createAccount,
																function(crypt_err2, resp_data){
																	if (crypt_err2){
																		callback(true, crypt_err2, null); // failed to decrypt the pii
																	}
																	else {
																		callback(false, {'data':resp_data, 'status':contracts.NewAcct_Success}, jwtoken);
																	}
																}
															);
															
															// NOW, do some auto-population of some fields
															moduleService.autoPopulate_userModStatus(qr2[0][0].u_id);
														}
													});
												}
											});
										}
									}
								});
								
							}
						});
						
					}
				}
			});
			
		}
	});
}


/*
	DEV endpoint(s)
*/

// createAccount_DEV does not use payment
exports.createAccount_DEV = function(user_sent_token, reqBody, callback){
	authService.verifyJWT(env.trust_level_RESTRICTED, user_sent_token, function(err, decoded) {
		if (err) {
			callback(true, err, null);
		}
		else if (!(decoded.email === reqBody.email_plain)) {
			logger.error("accountService.createAccount_DEV: EMAIL SWAP - %s != %s", decoded.email, reqBody.email_plain);
			callback(true, contracts.EmailSwap_Error, null);
		}
		else {
			var userInfo = JSON.stringify(reqBody.user_info);
			// comparing encrypted values
			db.query("CALL isUserInDatabase(?)", [reqBody.email], function(err1, qr1){
				if(err1) {
					logger.error("accountService.createAccount_DEV: isUserInDatabase(sql): ", err1);
					callback(true, contracts.DB_Access_Error, null);
				}
				else {
					if (qr1[0].length > 0) {
						logger.warn("accountService.createAccount_DEV: user email \'%s\' already in use", reqBody.email_plain);
						callback(true, contracts.Username_Taken, null);
					}
					else {
						// here we are storing the encrypted values...
						db.query("Call addUser(?,?,?)", [reqBody.email, reqBody.password, userInfo], function (err2, qr2) {
							if(err2) {
								// here if dbService is busted or constraint fails, right?
								logger.error("accountService.createAccount_DEV: addUser: ", err2);
								callback(true, contracts.DB_Access_Error, null);
							}
							else {
								if (qr2.affectedRows < 1 || qr2[0].length < 1) {
									// We should never get here. right?
									logger.warn("accountService.createAccount_DEV: FAILED to create account with user email \'%s\'", reqBody.email_plain);
									callback(true, contracts.Username_Taken, null);
								}
								else {
									cipherService.decrypt(qr2[0][0].email, function(crypt_err1, decrypted_email){
										if (crypt_err1) {
											callback(true, crypt_err1, null);
										} 
										else {
											authService.generateJWT(env.trust_level_FULL, {'email':decrypted_email, 'u_id':qr2[0][0].u_id}, function(err3, jwtoken) {
												if (err3) {
													callback(true, err3, null);
												}
												else {
													logger.info("accountService.createAccount_DEV: created account for %s", reqBody.email_plain);
													contracts.egress(
														{'email':qr2[0][0].email, 'user_info':qr2[0][0].user_info}, // encrypted values!
														contracts.createAccount_DEV,
														function(crypt_err2, resp_data){
															if (crypt_err2){
																callback(true, crypt_err2, null); // failed to decrypt the pii
															}
															else {
																callback(false, {'data':resp_data, 'status':contracts.NewAcct_Success}, jwtoken);
															}
														}
													);
													
													// NOW, do some auto-population of some fields
													moduleService.autoPopulate_userModStatus(qr2[0][0].u_id);
												}
											});
										}
									});
								}
							}
						});
					}
				}
			});
			
		}
	});
}















