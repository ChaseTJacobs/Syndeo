/*
	Syndeo API Request Body Contracts
	- All endpoints, unless explicitly stated, require a valid JWT in the request header to work right.
	- All endpoints, unless explicitly stated, are POST requests.
*/
var logger = 			require('winston');

exports.enforce = function(req, contract, callback){
	
	var resp_obj = { 
		'err' : false,
		'data' : []
	};
	
	var example = {};
	
	for (key in contract) {
		example[key] = contract[key].type;
		
		// catch missing required fields
		if (req.body[key] === undefined) {
			if (contract[key].required) {
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
			if (contract[key].required && req.body[key] === null) {
				// required field is NULL!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"required field is NULL", example});
			}
			else if ( (typeof req.body[key] != typeof contract[key].type) && !(req.body[key] === null) ) {
				// wrong type!
				resp_obj.err = true;
				resp_obj.data.push({'msg':"wrong field type", example});
			}
			// else, we're okay.
		}
		
		example = {};
	}
	
	logger.info("enforceContract: %s req body: ",(resp_obj.err ? "BAD" : "GOOD") ,req.body);
	callback(resp_obj.err, resp_obj, req);
	
}


exports.login = {
	'email':{
		'required':true,
		'type':"string"
	},
	'password':{
		'required':true,
		'type':"string"		
	}
};
exports.createAccount = {
	'email':{
		'required':true,
		'type':"string"
	},
	'password':{
		'required':true,
		'type':"string"		
	},
	'user_info':{
		'required':false,
		'type':{'object':"object"}		
	},
	'stripe_token':{
		'required':false,
		'type':"string"	
	}
};
exports.forgotPassword = {
	'email':{
		'required':true,
		'type':"string"
	}
};
exports.getUserInfo = {}
exports.updateUserInfo = {
	'user_info':{
		'required':true,
		'type':{'object':"object"}		
	}
};
exports.getContactList = {}
// - makePayment???
exports.createContact = {
	'firstname':{
		'required':true,
		'type':"string"
	},
	'lastname':{
		'required':true,
		'type':"string"		
	},
	'organization':{
		'required':false,
		'type':"string"		
	},
	'position':{
		'required':false,
		'type':"string"	
	},
	'email':{
		'required':false,
		'type':"string"		
	},
	'phone':{
		'required':false,
		'type':"string"		
	},
	'url_linkedin':{
		'required':false,
		'type':"string"		
	},
	'mail_address':{
		'required':false,
		'type':"string"		
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
};
exports.getContactInfo = {
	'c_id':{
		'required':true,
		'type':5
	}
}
exports.updateContactInfo = {
	'c_id':{
		'required':true,
		'type':5
	},
	'firstname':{
		'required':false,
		'type':"string"
	},
	'lastname':{
		'required':false,
		'type':"string"		
	},
	'organization':{
		'required':false,
		'type':"string"		
	},
	'position':{
		'required':false,
		'type':"string"	
	},
	'email':{
		'required':false,
		'type':"string"		
	},
	'phone':{
		'required':false,
		'type':"string"		
	},
	'url_linkedin':{
		'required':false,
		'type':"string"		
	},
	'mail_address':{
		'required':false,
		'type':"string"		
	},
	'notes':{
		'required':false,
		'type':"string"		
	},
	'other_info':{
		'required':false,
		'type':{'object':"object"}		
	}
};
exports.updateContactStats = {
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
};
exports.deleteContact = {
	'c_id':{
		'required':true,
		'type':5
	}
}
exports.deleteActivity = {
	'a_id':{
		'required':true,
		'type':5
	}
}
exports.createActivity = {
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
	}
}
exports.getContactActivities = {
	'c_id':{
		'required':true,
		'type':5
	}
}
exports.getActivityList = {}
exports.updateActivity = {
	// No c_id here. can't change who an activity belongs to.
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
		'type':true
	}
}
exports.createIIscript = {
	'c_id':{
		'required':true,
		'type':5
	},
	'text':{
		'required':true,
		'type':"string"
	}
}
exports.getContactIIScripts = {
	'c_id':{
		'required':true,
		'type':5
	}
}
exports.getIIScriptQs = {}
exports.createIIScriptQ = {
	'text':{
		'required':true,
		'type':"string"
	}
}
exports.deleteIIScriptQ = {
	'q_id':{
		'required':true,
		'type':5
	}
}
exports.updateIIscript = {
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
}
exports.deleteIIscript = {
	'ii_id':{
		'required':true,
		'type':5
	},
	'c_id':{
		'required':true,
		'type':5
	}
}
exports.getModuleList = {}
exports.getModuleContent = {
	'mod_id':{
		'required':true,
		'type':5
	}
}
exports.updateMyModules = {
	'mod_id':{
		'required':true,
		'type':5
	},
	'interested':{
		'required':false,
		'type':true
	},
	'completed':{
		'required':false,
		'type':true
	},
	'in_progress':{
		'required':false,
		'type':true
	}
}
exports.getAllCounters = {}
exports.updateGlobalCounters = {
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
}


/*
	Syndeo API Response Body Contracts
	- see our docs for more readable notes
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
/*
			TODO: integrate request & response contracts.
			TODO: make the status codes make sense relationship-wise.
			TODO: implement "contracts.______" functionality on the front-end.
*/
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
