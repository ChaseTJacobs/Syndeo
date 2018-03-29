var db = 				require("./dbService");
var authService = 	require('./authService');
var contracts = 		require('./contracts');
var logger = 			require('winston');

exports.getActivityTypes = function(user_sent_token, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			// Query DB for contacts
			db.query("CALL getActivityTypes(?)", 
				[decoded_token.u_id], 
				function(err, qr){
					if(err) {
						logger.error("activityService.getActivityTypes: getActivityTypes(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							logger.warn("activityService.getActivityTypes: no activities exist (empty activity type table)");
							callback( contracts.DB_Access_Error );
						}
						else {
							logger.info("activityService.getActivityTypes: success.");
							callback( {'data': {'activity_types':qr[0]}, 'status':contracts.GetActType_Success} );
						}
					}
			});
		}
	});
}


exports.updateActivity = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL updateActivity(?,?,?,?,?,?,?,?)", 
				[decoded_token.u_id, req_body.a_id, req_body.atype_id, req_body.activity_name, req_body.event_date, req_body.notes, req_body.completed, req_body["location"]], 
				function(err, qr){
					if(err) {
						logger.error("activityService.updateActivity: updateActivity(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// failed to update the Activity. There are several constraints.
							logger.warn("activityService.updateActivity: user %d cannot modify activity %d", decoded_token.u_id, req_body.a_id);
							callback(contracts.Bad_ActivityID);
						}
						else {
							logger.info("activityService.updateActivity: success.");
							callback( contracts.UpdateAct_Success );
						}
					}
			});
		}
	});
}


exports.getContactActivities = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL getContActs(?,?)", 
				[decoded_token.u_id, req_body.c_id], 
				function(err, qr){
					if(err) {
						logger.error("activityService.getContactActivities: getContActs(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							// you don't have any activities for this contact...
							logger.warn("activityService.getContactActivities: no activities exist for user %d & contact %d", decoded_token.u_id, req_body.c_id);
							callback( contracts.No_ContActs );
						}
						else {
							logger.info("activityService.getContactActivities: success.");
							callback( {'data': {'activities':qr[0]}, 'status':contracts.GetContActs_Success} );
						}
					}
			});
		}
	});
}


exports.getActivityList = function(user_sent_token, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			// Query DB for contacts
			db.query("CALL getAllActivities(?)", 
				[decoded_token.u_id], 
				function(err, qr){
					if(err) {
						logger.error("activityService.getActivityList: getAllActivities(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr[0].length == 0) {
							// you don't have any activities...
							logger.warn("activityService.getActivityList: no activities exist for user %d.", decoded_token.u_id);
							callback( contracts.No_Activities );
						}
						else {
							logger.info("activityService.getActivityList: success.");
							callback( {'data': {'activities':qr[0]}, 'status':contracts.GetActs_Success} );
						}
					}
			});
		}
	});
}


exports.deleteActivity = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			callback(error);
		}
		else {
			db.query("CALL deleteActivity(?,?)", 
				[decoded_token.u_id, req_body.a_id],
				function(err, qr){
					if(err) {
						logger.error("activityService.deleteActivity: deleteActivity(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// either that a_id doesn't exist, or it doesn't belong to you.
							logger.warn("activityService.deleteActivity: user, u_id=%d cannot delete activity, a_id=%d", decoded_token.u_id, req_body.a_id);
							callback(contracts.Bad_ActivityID);
						}
						else {
							logger.info("activityService.deleteActivity: success.");
							callback( contracts.DeleteAct_Success );
						}
					}
			});
		}
	});
}


exports.createActivity = function(user_sent_token, req_body, callback){
	authService.verifyJWT(env.trust_level_FULL, user_sent_token, function(error, decoded_token) {
		if (error) {
			// Any JWT error should require user to log in again.
			callback(error);
		}
		else {
			db.query("CALL newActivity(?,?,?,?,?,?,?,?)", 
				[decoded_token.u_id, req_body.c_id, req_body.atype_id, req_body.activity_name, req_body.event_date, req_body.notes, req_body.completed, req_body["location"]], 
				function(err, qr){
					if(err) {
						logger.error("activityService.createActivity: newActivity(sql): ", err);
						callback(contracts.DB_Access_Error);
					}
					else {
						if (qr.affectedRows < 1) {
							// failed to create the Activity. There are several constraints.
							logger.warn("activityService.createActivity: user %d failed to create Activity", decoded_token.u_id);
							callback(contracts.NewActivity_Failure);
						}
						/*else if (qr[0] == null) {
							// failed to create the Activity. There are several constraints.
							logger.warn("activityService.createActivity: user %d cannot create Activity for contact %d", decoded_token.id, req_body.c_id);
							callback(contracts.Bad_ContactID);//callback(contracts.NewActivity_Failure);
						}*/
						else {
							logger.info("activityService.createActivity: success.");
							callback( contracts.NewActivity_Success );
						}
					}
			});
		}
	});
}

