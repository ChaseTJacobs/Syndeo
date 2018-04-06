var env = require('./environment');
var cipherService = require('./services/cipherService');
var logger = require('winston');

exports.ingress = function(req, contract, callback){
	var example = {};
	var resp_obj = { 
		'err' : false,
		'data' : []
	};
	
	for (key in contract.reqs) {
		example[key] = contract.reqs[key].type;
		// catch missing required fields
		if (req.body[key] === undefined) {
			if (contract.reqs[key].required) {
				// missing required field!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"missing required field", example});
			}
			else {
				// create non-required field and assign it placeholder value of NULL
				req.body[key] = null;
			}
		}
		else {
			if ((contract.reqs[key].required) &&
				((req.body[key] === null) || (typeof contract.reqs[key].type === typeof "string" && req.body[key] === ""))) {
					// required field is NULL/empty!
					resp_obj.err = true;
					resp_obj.data.push({'msg':"required field is NULL/empty", example});
			}
			else if ( (typeof req.body[key] != typeof contract.reqs[key].type) && !(req.body[key] === null) ) {
				// wrong type!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"wrong field type", example});
			}
			// else, we're okay.
			else if (contract.reqs[key].is_pii) {
				// encrypt Personally Identifying Information
				// logger.info("ingress: encrypting pii, {%s : %s}...", key, req.body[key]);
				req.body[key+"_plain"] = req.body[key]; // for use by endpoint logic
				cipherService.encrypt(req.body[key], function(err, encrypted){
					if (err) {
						// TODO: We need an official error code for this
						callback(true, {'data':[{'msg':"failed to encrypt pii"}]}, req); 
					}
					else {
						req.body[key] = encrypted;
					}
				});
			}
		}
		example = {};
	}
	
	// logger.info("enforceContract: %s req body: ",(resp_obj.err ? "BAD" : "GOOD") ,req.body);
	logger.info("enforceContract: %s",(resp_obj.err ? "BAD" : "GOOD"));
	callback(resp_obj.err, resp_obj, req);
	
}
exports.egress = function(response_data, contract, callback){
	// logger.info("egress: response data IN = %s", JSON.stringify(response_data));
	if (response_data instanceof Array){
		for (key in contract.resp) {
			// for (row in response_data){
			response_data.forEach(function(row){
				if (contract.resp[key].is_pii && /*not null or undefined*/ row[key]){
					cipherService.decrypt(row[key], function(err, decrypted){
						if (err) {
							// TODO: We need an official error code for this. here or in cipherService.
							callback(err, null); 
						}
						else {
							row[key] = decrypted;
						}
					});
				}
			});
			// }
		}
	}
	else {
		for (key in contract.resp) {
			if (contract.resp[key].is_pii && /*not null or undefined*/ response_data[key]){
				cipherService.decrypt(response_data[key], function(err, decrypted){
					if (err) {
						// TODO: We need an official error code for this
						callback(err, null); 
					}
					else {
						response_data[key] = decrypted;
					}
				});
			}
		}
	}
	// logger.info("egress: response data OUT = ", response_data);
	callback(null, response_data);
}

// TODO: add non-pii fields to resp objs for completeness sake.
// Email
exports.emailToken = {
	'reqs':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	},
	'resp':{}
};
exports.confirmEmail = {
	'reqs':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'token':{
			'required':true,
			'type':"string"
		}
	},
	'resp':{}
};
// Account
exports.updateForgotPass = {
	'reqs':{	
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'new_password':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	},
	'resp':{}
};
exports.createAccount_DEV = {
	'reqs':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'password':{
			'required':true,
			'type':"string",
			'is_pii':true		
		},
		'user_info':{
			'required':false,
			'type':{'object':"object"}		
		},
		'stripe_token':{
			'required':false,
			'type':"string"	
		}
	},
	'resp':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	}
};
exports.createAccount = {
	'reqs':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'password':{
			'required':true,
			'type':"string",
			'is_pii':true		
		},
		'user_info':{
			'required':false,
			'type':{'object':"object"}		
		},
		'stripe_token':{
			'required':true,
			'type':"string"	
		}
	},
	'resp':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	}
};
exports.login = {
	'reqs':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'password':{
			'required':true,
			'type':"string",
			'is_pii':true		
		}
	},
	'resp':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	}
};
exports.getUserInfo = {
	'resp':{
		'email':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	}
}
exports.changePassword = {
	'reqs':{
		'old_password':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'new_password':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	},
	'resp':{}
};
exports.updateUserInfo = {
	'reqs':{
		'user_info':{
			'required':true,
			'type':{'object':"object"}		
		}
	},
	'resp':{}
};
exports.getAllCounters = {
	'resp':{}
}
exports.updateGlobalCounters = {
	'reqs':{
		'email_response':{
			'required':false,
			'type':5
		},
		'resume_request':{      
			'required':false,
			'type':5
		},
		'msg_or_call_from':{
			'required':false,
			'type':5
		}
	},
	'resp':{}
}
// Contacts
exports.getContactList = {
	'resp':{
		'firstname':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'lastname':{
			'required':true,
			'type':"string",
			'is_pii':true
		}
	}
}
exports.createContact = {
	'reqs':{
		'firstname':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'lastname':{
			'required':true,
			'type':"string",
			'is_pii':true	
		},
		'organization':{
			'required':false,
			'type':"string"		
		},
		'position':{
			'required':false,
			'type':"string",
			'is_pii':true	
		},
		'email':{
			'required':false,
			'type':"string",
			'is_pii':true		
		},
		'phone':{
			'required':false,
			'type':"string",
			'is_pii':true		
		},
		'url_linkedin':{
			'required':false,
			'type':"string",
			'is_pii':true		
		},
		'mail_address':{
			'required':false,
			'type':"string",
			'is_pii':true		
		},
		'notes':{
			'required':false,
			'type':"string"		
		},
		'other_info':{
			'required':false,
			'type':{'object':"object"},
		},
		'created_milli':{
			'required':false,
			'type':5//millisecs
		}
	},
	'resp':{}
};
exports.getContactInfo = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{
		'firstname':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'lastname':{
			'required':true,
			'type':"string",
			'is_pii':true
		},
		'position':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'email':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'phone':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'url_linkedin':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'mail_address':{
			'required':false,
			'type':"string",
			'is_pii':true
		}
	}
}
exports.updateContactInfo = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		},
		'firstname':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'lastname':{
			'required':false,
			'type':"string",
			'is_pii':true		
		},
		'organization':{
			'required':false,
			'type':"string"		
		},
		'position':{
			'required':false,
			'type':"string",
			'is_pii':true	
		},
		'email':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'phone':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'url_linkedin':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'mail_address':{
			'required':false,
			'type':"string",
			'is_pii':true
		},
		'notes':{
			'required':false,
			'type':"string"		
		},
		'other_info':{
			'required':false,
			'type':{'object':"object"}		
		}
	},
	'resp':{}
};
exports.updateContactStats = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		},
		'email_response':{
			'required':false,
			'type':5
		},
		'resume_request':{
			'required':false,
			'type':5		
		},
		'msg_or_call_from':{
			'required':false,
			'type':5		
		}
	},
	'resp':{}
};
exports.deleteContact = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
// Activities
exports.deleteActivity = {
	'reqs':{
		'a_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
exports.createActivity = {
	'reqs':{
		'c_id':{
			'required':false,
			'type':5
		},
		'atype_id':{
			'required':true,
			'type':5
		},
		'activity_name':{
			'required':true,
			'type':"string"
		},
		'event_date':{
			'required':true,
			'type':5
		},
		'notes':{
			'required':false,
			'type':"string"
		},
		'completed':{
			'required':false,
			'type':5 // 0/1 = t/f
		},
		'location':{
			'required':false,
			'type':"string"
		}
	},
	'resp':{}
}
exports.getContactActivities = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
exports.getActivityTypes = {
	'resp':{}
}
exports.getActivityList = {
	'resp':{}
}
exports.updateActivity = {
	// No c_id here. can't change who an activity belongs to.
	'reqs':{
		'a_id':{
			'required':true,
			'type':5
		},
		'atype_id':{
			'required':false,
			'type':5
		},
		'activity_name':{
			'required':false,
			'type':"string"
		},
		'event_date':{
			'required':false,
			'type':5
		},
		'notes':{
			'required':false,
			'type':"string"
		},
		'completed':{
			'required':false,
			'type':5
		},
		'location':{
			'required':false,
			'type':"string"
		}
	},
	'resp':{}
}
// IIScripts
exports.createIIscript = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		},
		'text':{
			'required':true,
			'type':"string"
		}
	},
	'resp':{}
}
exports.getContactIIScripts = {
	'reqs':{
		'c_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
exports.getIIScriptQs = {
	'resp':{}
}
exports.createIIScriptQ = {
	'reqs':{
		'text':{
			'required':true,
			'type':"string"
		}
	},
	'resp':{}
}
exports.deleteIIScriptQ = {
	'reqs':{
		'q_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
exports.updateIIscript = {
	'reqs':{
		'ii_id':{
			'required':true,
			'type':5
		},
		'c_id':{
			'required':true,
			'type':5
		},
		'text':{
			'required':true,
			'type':"string"
		}
	},
	'resp':{}
}
exports.deleteIIscript = {
	'reqs':{
		'ii_id':{
			'required':true,
			'type':5
		},
		'c_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
// Modules
exports.getModuleList = {
	'resp':{}
}
exports.getUserModStatus = {
	'resp':{}
}
exports.getModuleContent = {
	'reqs':{
		'mod_id':{
			'required':true,
			'type':5
		}
	},
	'resp':{}
}
exports.updateMyModules = {
	'reqs':{
		'mod_id':{
			'required':true,
			'type':5
		},
		'recommended':{
			'required':false,
			'type':5
		},
		'interested':{
			'required':false,
			'type':5
		},
		'completed':{
			'required':false,
			'type':5
		},
		'in_progress':{
			'required':false,
			'type':5
		}
	},
	'resp':{}
}


/*
	Syndeo API Response Body Contracts
	- see our docs for more readable notes
*/
/*
			TODO: integrate request & response contracts.
			TODO: make the status codes make sense relationship-wise.
			TODO: implement "contracts.______" functionality on the front-end.
*/
// General
exports.DB_Access_Error = { 'data':"DB error. This is a problem.", 'status':299 };
// IDEA: in event of "DB_Access_Error", requested changes should be saved locally and tried again later.
exports.Stripe_Error = { 'data':"Stripe Token Error", 'status':298 };
// Auth Service
exports.JWT_Generation_Error = { 'data':"Could not generate JWT.", 'status':297 };
exports.JWT_Expiration_Error = { 'data':"Your JWT is Expired.", 'status':296 };
exports.JWT_Malformed_Error = { 'data':"Your JWT is Malformed.", 'status':295 };
// Account Service
exports.Login_Success = 110; // data = user_info
exports.Bad_Creds = { 'data':"Incorrect Username or Password.", 'status':210 };
exports.NewAcct_Success = 111; // data = user_info
exports.Username_Taken = { 'data':"an account already exists in connection with this email", 'status':211 };
// Contact Service
exports.GetList_Success = 112;
exports.NewContact_Success = 113;
exports.GetContInfo_Success = 114;
exports.Bad_ContactID = { 'data':"requested contact info/activity with bad c_id", 'status':214 }; // getContactInfo
exports.UpdateContInfo_Success = { 'data':"success", 'status':115 }; // updateContactInfo
exports.UpdateContStats_Success = { 'data':"success", 'status':116 }; // updateContactStats
// more Account Service
exports.Bad_UserID = { 'data':"requested with possible bad u_id.", 'status':215 }; // getUserInfo // JWT breach or account delete shortly after login.
exports.GetUinfo_Success = 117;
exports.UpdateUinfo_Success = { 'data':"Success", 'status':118 };
// more Contact Service
exports.DeleteContact_Success = { 'data':"Success", 'status':119 };
// Activities
exports.NewActivity_Success = { 'data':"Success", 'status':120 };
exports.NewActivity_Failure = { 'data':"Failure. There are a number of reasons why this might happen", 'status':216 };
exports.GetActs_Success = 121;
exports.No_Activities = { 'data':"you appear to have created zero activities", 'status':122 };
exports.GetContActs_Success = 123;
exports.No_ContActs = { 'data':"0 activities associated with this contact", 'status':124 };
exports.DeleteAct_Success = { 'data':"Success", 'status':125 };
exports.Bad_ActivityID = { 'data':"bad activity id.", 'status':217 };
exports.UpdateAct_Success = { 'data':"Success", 'status':126 };
// iiScripts
exports.NewIIscript_Success = { 'data':"Success", 'status':127 };
exports.NewIIscript_Failure = { 'data':"Failure", 'status':218 };
exports.DeleteIIscript_Success = { 'data':"Success", 'status':128 };
exports.DeleteIIscript_Failure = { 'data':"Failure. 1 or more of (c_id, ii_id) may be in error", 'status':219 };
exports.GetIIscript_Success = 129;
exports.UpdateIIscript_Success = { 'data':"Success", 'status':130 };
exports.UpdateIIscript_Failure = { 'data':"Failure. 1 or more of (c_id, ii_id) may be in error", 'status':220 };
exports.GetContIIscripts_Success = 131;
exports.No_GetContIIscripts = { 'data':"this contact has 0 iiScripts", 'status':132 }; // could be bad ii_id, c_id,
exports.NewQ_Failure = { 'data':"Failure. Couldn't save your custom iiScripts Question", 'status':221 };
exports.NewQ_Success = { 'data':"Success. custom iiScript Question saved", 'status':133 };
exports.DeleteQ_Failure = { 'data':"Failure. Couldn't delete your custom iiScripts Question", 'status':222 };
exports.DeleteQ_Success = { 'data':"Success. custom iiScript Question deleted", 'status':134 };
// more Account (counters)
exports.UpdateGcounters_Success = { 'data':"Success. global counters updated", 'status':135 };
exports.GetAllCounters_Success = 136;
// more Activities
exports.GetActType_Success = 137;
// more Account
exports.ForgotPass_BadEmailAddr = { 'data':"Failure. No account attached to that email address", 'status':223 };
exports.UpdatePass_Success = 138;
exports.UpdatePass_Failure = { 'data':"Failure. Token Mismatch", 'status':224 };
// Email 
exports.TokenSent = { 'data':"Success. Token Emailed.", 'status':139 };
exports.EmailConfirm_Failure = { 'data':"Failure. Invalid Token for given Email Address.", 'status':225 };
exports.EmailConfirmed = { 'data':"Success. Email Confirmed!", 'status':140 };
exports.EmailSwap_Error = { 'data':"Error. Given Email != Tokened Email.", 'status':226 };
// Account...
exports.ChangePass_Failure = { 'data':"Failure. Could not change password.", 'status':227 };
exports.ChangePass_Success = { 'data':"Success. Password Changed. You will be notified by email.", 'status':141 };
// Modules
exports.GetModList_Success = 142;
exports.GetContent_Success = 143;
exports.Bad_ModID = { 'data':"Failure. Bad value mod_id.", 'status':228 };
exports.UpdateModStatus_Success = {'data':"Success. Module Status Updated.", 'status':144};
exports.UpdateModStatus_Failure = {'data':"Failure. Could not Update Module Status.", 'status':229};
exports.GetUserModStatus_Success = 145;