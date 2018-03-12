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


// - login (does not require JWT in header)
exports.login = 
{
	'email':{
		'required':true,
		'type':"string"
	},
	'password':{
		'required':true,
		'type':"string"		
	}
};
// - createAccount (does not require JWT in header)
exports.createAccount = 
{
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
// - forgotPassword (does not require JWT in header)
exports.forgotPassword =
{
	'email':{
		'required':true,
		'type':"string"
	}
};
// - getUserInfo (GET)
exports.getUserInfo = {}
// - updateUserInfo
exports.updateUserInfo = 
{
	'user_info':{
		'required':true,
		'type':{'object':"object"}		
	}
};
// - getContactList (GET)
exports.getContactList = {}
// - makePayment???

// - createContact
exports.createContact =
{
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
// - getContactInfo
exports.getContactInfo = 
{
	'c_id':{
		'required':true,
		'type':5
	}
}
// - updateContactInfo
exports.updateContactInfo =
{
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
// - updateContactStats
exports.updateContactStats =
{
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
// - createActivity
exports.createActivity = 
{
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
		'type':true
	}
}
// - createIIscript
exports.createIIscript = 
{
	'c_id':{
		'required':true,
		'type':5
	},
	'text':{
		'required':true,
		'type':"string"
	}
}
// - getContactActivities
exports.getContactActivities =
{
	'c_id':{
		'required':true,
		'type':5
	}
}
// - getContactIIScripts
exports.getContactIIScripts =
{
	'c_id':{
		'required':true,
		'type':5
	}
}
// - getIIScriptQs (GET)
exports.getIIScriptQs = {}
// - updateActivity
exports.updateActivity = 
{
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
// - updateContactIIScript
exports.updateContactIIScript = 
{
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
// - deleteContact
exports.deleteContact = 
{
	'c_id':{
		'required':true,
		'type':5
	}
}
// - deleteActivity
exports.deleteActivity = 
{
	'a_id':{
		'required':true,
		'type':5
	}
}
// - deleteIIScript
exports.deleteIIScript = 
{
	'ii_id':{
		'required':true,
		'type':5
	},
	'c_id':{
		'required':true,
		'type':5
	}
}
// - getModuleList (GET)
exports.getModuleList = {}
// - getModuleContent
exports.getModuleContent = 
{
	'mod_id':{
		'required':true,
		'type':5
	}
}
// - updateMyModules
exports.updateMyModules = 
{
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
// - getActivityList (GET)
exports.getActivityList = {}
// - getAllCounters (GET)
exports.getAllCounters = {}
// - updateGlobalCounters
exports.updateGlobalCounters = 
{
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
exports.Bad_ContactID = { 'data':"requested contact info with bad c_id", 'status':214 }; // getContactInfo
exports.UpdateContInfo_Success = { 'data':"success", 'status':115 }; // updateContactInfo
exports.UpdateContStats_Success = { 'data':"success", 'status':116 }; // updateContactStats









