var db = 				require("./dbService");
var authService = 	require('./authService');
var contracts = 		require('../contracts');
var logger = 			require('winston');
var env = 	require('../environment');


exports.updateMyModules = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL updateUserModuleStatus(?,?,?,?,?)", 
				[decoded_token.u_id, req_body.mod_id, req_body.interested, req_body.completed, req_body.in_progress], 
				function(err, qr){
					if(err) {
						logger.error("moduleService.updateMyModules: updateUserModuleStatus(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							logger.warn("moduleService.updateMyModules: cannot modify user %d\'s status for module %d", decoded_token.u_id, req_body.mod_id);
							callback(contracts.UpdateModStatus_Failure);
						}
						else {
							logger.info("moduleService.updateMyModules: success.");
							callback( contracts.UpdateModStatus_Success );
						}
					}
			});
		}
	});
}


exports.getModuleContent = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL getModuleContent(?,?)", [decoded_token.u_id, req_body.mod_id], function(err, qr){
				if(err) {
					logger.error("moduleService.getModuleContent: getModuleContent(sql): ", err);
					callback(contracts.DB_Access_Error);
				}
				else {
					if (qr[0].length == 0) {
						logger.warn("moduleService.getModuleContent: user %d cannot access module %d", decoded_token.u_id, req_body.mod_id);
						callback( contracts.Bad_ModID );
					}
					else {
						logger.info("moduleService.getModuleContent: success.");
						callback( {'data': qr[0], 'status':contracts.GetContent_Success} );
					}
				}
			});
		}
	});
}


exports.getModuleList = function(user_sent_token, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL getModuleList(?)", [decoded_token.u_id], function(err, qr){
				if(err) {
					logger.error("moduleService.getModuleList: getModuleList(sql): ", err);
					callback(contracts.DB_Access_Error);
				}
				else {
					if (qr[0].length == 0) {
						logger.warn("moduleService.getModuleList: no Module data available to user %d.", decoded_token.u_id, qr);
						callback( contracts.Bad_UserID );
					}
					else {
						logger.info("moduleService.getModuleList: success.");
						callback( {'data': qr[0], 'status':contracts.GetModList_Success} );
					}
				}
			});
		}
	});
}
