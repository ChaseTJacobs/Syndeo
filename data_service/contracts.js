/*
	Syndeo API Request Body Contracts
	- All endpoints, unless explicitly stated, require a valid JWT in the request header to work right.
	- All endpoints, unless explicitly stated, are POST requests.
*/
var logger = 			require('winston');

exports.enforce = function(req, contract, callback){
	// console.log("Request Body: "+JSON.stringify(req.body));
	// console.log("    Contract: "+JSON.stringify(contract));
	
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
			else if (typeof req.body[key] != typeof contract[key].type) {
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
	'pass':{
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
	'pass':{
		'required':true,
		'type':"string"		
	},
	'userInfo':{
		'required':false,
		'type':{'object':"object"}		
	},
	'stripeToken':{
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

// - updateUserInfo
exports.updateUserInfo = 
{
	'userInfo':{
		'required':true,
		'type':{'object':"object"}		
	}
};
// - makePayment???

// - createContact
exports.createContact =
{
	'fName':{
		'required':true,
		'type':"string"
	},
	'lName':{
		'required':true,
		'type':"string"		
	},
	'company':{
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
	'linkedIn':{
		'required':false,
		'type':"string"		
	},
	'address':{
		'required':false,
		'type':"string"		
	},
	'description':{
		'required':false,
		'type':"string"		
	},
	'custom':{
		'required':false,
		'type':{'object':"object"}		
	}
};
// - createActivity
exports.createActivity = 
{
	'contactID':{
		'required':false,
		'type':5
	},
	'actType':{
		'required':true,
		'type':5
	},
	'actName':{
		'required':true,
		'type':"string"
	},
	'actDate':{
		'required':true,
		'type':5
	},
	'description':{
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
	'contactID':{
		'required':true,
		'type':5
	},
	'text':{
		'required':true,
		'type':"string"
	}
}
// - getContactList (GET)
exports.getContactList = {}

// - getContactInfo
exports.getContactInfo = 
{
	'contactID':{
		'required':true,
		'type':5
	}
}
// - getContactActivities
exports.getContactActivities =
{
	'contactID':{
		'required':true,
		'type':5
	}
}
// - getContactIIScripts
exports.getContactIIScripts =
{
	'contactID':{
		'required':true,
		'type':5
	}
}
// - getIIScriptQs (GET)

// - updateContactInfo
exports.updateContactInfo =
{
	'contactID':{
		'required':true,
		'type':5
	},
	'fName':{
		'required':false,
		'type':"string"
	},
	'lName':{
		'required':false,
		'type':"string"		
	},
	'company':{
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
	'linkedIn':{
		'required':false,
		'type':"string"		
	},
	'address':{
		'required':false,
		'type':"string"		
	},
	'description':{
		'required':false,
		'type':"string"		
	},
	'custom':{
		'required':false,
		'type':{'object':"object"}		
	}
};
// - updateActivity
exports.updateActivity = 
{
	'actID':{
		'required':true,
		'type':5
	},
	'actType':{
		'required':false,
		'type':5
	},
	'actName':{
		'required':false,
		'type':"string"
	},
	'actDate':{
		'required':false,
		'type':5
	},
	'description':{
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
	'scriptID':{
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
	'contactID':{
		'required':true,
		'type':5
	}
}
// - deleteActivity
exports.deleteActivity = 
{
	'actID':{
		'required':true,
		'type':5
	}
}
// - deleteIIScript
exports.deleteIIScript = 
{
	'scriptID':{
		'required':true,
		'type':5
	}
}
// - getModuleList (GET)

// - getModuleContent
exports.getModuleContent = 
{
	'moduleID':{
		'required':true,
		'type':5
	}
}
// - updateMyModules
exports.updateMyModules = 
{
	'moduleID':{
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
	'inProgress':{
		'required':false,
		'type':true
	}
}
// - getActivityList (GET)

// - getAllCounters (GET)

// - updateGlobalCounters
exports.updateGlobalCounters = 
{
	'emailResp':{
		'required':false,
		'type':5
	},
	'resumeReq':{
		'required':false,
		'type':5
	},
	'msgORcall':{
		'required':false,
		'type':5
	}
}
/*
var test_body = 
{
	'email':"testEMaillll",
	'pass':"testPasswoerd",
	'userInfo':"poop"
};

enforceContract(test_body, createAccount, function(err, err_obj) {
	if (err) {
		console.log(JSON.stringify(err_obj.data));
	}
	else
		console.log("It's all good!");
});*/



/*
	Syndeo API Response Body Contracts
	- 
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

