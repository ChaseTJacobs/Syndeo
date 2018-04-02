var db = 				require("./dbService");
var authService = 	require('./authService');
var contracts = 		require('./contracts');
var logger = 			require('winston');
var env = 	require('../environment');

// TODO - TEST all of these...

exports.updateIIscript = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL updateIIscript(?,?,?,?)", 
				[decoded_token.u_id, req_body.ii_id, req_body.c_id, req_body.text], 
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.updateIIscript: updateIIscript(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							logger.warn("iiScriptService.updateIIscript: user %d cannot modify iiScript %d", decoded_token.u_id, req_body.ii_id);
							callback(contracts.UpdateIIscript_Failure);
						}
						else {
							logger.info("iiScriptService.updateIIscript: success.");
							callback( contracts.UpdateIIscript_Success );
						}
					}
			});
		}
	});
}


exports.getIIScriptQs = function(user_sent_token, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			// Query DB for contacts
			db.query("CALL getIIscriptQs(?)", 
				[decoded_token.u_id], 
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.getIIScriptQs: getIIscriptQs(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							logger.error("iiScriptService.getIIScriptQs: cant find ANY iiScripts for user %d.", decoded_token.u_id, qr);
							callback( contracts.Bad_UserID );
						}
						else {
							logger.info("iiScriptService.getIIScriptQs: success.");
							callback( {'data': {'iiScriptQs':qr[0]}, 'status':contracts.GetIIscript_Success} );
						}
					}
			});
		}
	});
}


exports.deleteIIScriptQ = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL deleteIIScriptQ(?,?)", 
				[decoded_token.u_id, req_body.q_id],
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.deleteIIScriptQ: deleteIIScriptQ(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							logger.warn("iiScriptService.deleteIIScriptQ: user %d cannot delete iiScript Question %d", decoded_token.u_id, req_body.q_id);
							callback(contracts.DeleteQ_Failure);
						}
						else {
							logger.info("iiScriptService.deleteIIScriptQ: success.");
							callback( contracts.DeleteQ_Success );
						}
					}
			});
		}
	});
}


exports.createIIScriptQ = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL newIIscriptQ(?,?)", 
				[decoded_token.u_id, req_body.text], 
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.createIIScriptQ: newIIscriptQ(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							logger.warn("iiScriptService.createIIScriptQ: user %d failed to create new iiScript question", decoded_token.u_id);
							callback(contracts.NewQ_Failure);
						}
						else {
							logger.info("iiScriptService.createIIScriptQ: success.");
							callback( contracts.NewQ_Success );
						}
					}
			});
		}
	});
}


exports.deleteIIscript = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL deleteIIscript(?,?,?)", 
				[decoded_token.u_id, req_body.ii_id, req_body.c_id],
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.deleteIIscript: deleteIIscript(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// not your contact, or not your iiScript, or both
							logger.warn("iiScriptService.deleteIIscript: user, u_id=%d cannot delete iiScript, ii_id=%d", decoded_token.u_id, req_body.ii_id);
							callback(contracts.DeleteIIscript_Failure);
						}
						else {
							logger.info("iiScriptService.deleteIIscript: success.");
							callback( contracts.DeleteIIscript_Success );
						}
					}
			});
		}
	});
}


exports.getContactIIScripts = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL getContactIIScripts(?,?)", 
				[decoded_token.u_id, req_body.c_id], 
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.getContactIIScripts: getContactIIScripts(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							logger.error("iiScriptService.getContactIIScripts: cant find ANY iiScripts for contact %d.", req_body.c_id);
							callback( contracts.No_GetContIIscripts );
						}
						else {
							logger.info("iiScriptService.getContactIIScripts: success.");
							callback( {'data': qr[0], 'status':contracts.GetContIIscripts_Success} );
						}
					}
			});
		}
	});
}


exports.createIIscript = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL newIIscript(?,?,?)", 
				[decoded_token.u_id, req_body.c_id, req_body.text], 
				function(err, qr){
					if(err) {
						logger.error("iiScriptService.createIIscript: newIIscript(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// failed to create the iiScript
							logger.warn("iiScriptService.createIIscript: user %d failed to create iiScript", decoded_token.u_id);
							callback(contracts.NewIIscript_Failure);
						}
						/*else if (qr[0] == null) {
							// failed to create the Activity. There are several constraints.
							logger.warn("iiScriptService.createIIscript: user %d cannot create iiScript for contact %d", decoded_token.id, req_body.c_id);
							callback(contracts.Bad_ContactID);//callback(contracts.NewActivity_Failure);
						}*/
						else {
							logger.info("iiScriptService.createIIscript: success.");
							callback( contracts.NewIIscript_Success );
						}
					}
			});
		}
	});
}

