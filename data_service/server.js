var express = require('express');
var bodyParser = require('body-parser');
var path = require('path'); // for serving static content
var logger = require('winston');
var contracts = require('./contracts');
var env = require('./environment');
var authService = require('./services/authService');
var emailService = require('./services/emailService');
var accountService = require('./services/accountService');
var contactService = require('./services/contactService');
var activityService = require('./services/activityService');
var iiScriptService = require('./services/iiScriptService');
var moduleService = require('./services/moduleService');

var app = express();
var jsonParser = bodyParser.json({"type":"application/json"});
var port = env.port;

/*logger.add(logger.transports.File, {
	filename: 'combined.log',
	handleExceptions: true,
	humanReadableUnhandledException: true
});*/
logger.exitOnError = false;

// allow certain headers
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// handles jsonParser's responses & enforces request body contracts.
requestBodyHandler = function(contract, req, res, callback) {
	if (!req.body) {
			return res.sendStatus(400);
	}
	else {
		contracts.ingress(req, contract, function(err, err_obj, req) {
			if (err) {
				// logger.warn("bodyHandler, error: ", err_obj.data);
				// This also fires off if encryption of pii fails. That's a 500 error.
				res.send(err_obj);
			}
			else {
				// logger.info("bodyHandler, OK.")
				callback(req, res);
			}
		});
	}
}

/* ~~~ Here Be Endpoints ~~~ */

// Email Endpoints
app.post('/emailToken', jsonParser, function(req, res) {
	logger.info("hit \'emailToken\'");
	requestBodyHandler(contracts.emailToken, req, res, 
		function (req, res) {
			emailService.emailToken( req.body, function(err, response, token) {
				if (err) {
					res.send( response );
				}
				else {
					res.set('Authorization', token);
					res.set('Access-Control-Expose-Headers', 'Authorization');
					res.send( response );
				}
			});
		});
});
app.post('/confirmEmail', jsonParser, function(req, res) {
	logger.info("hit \'confirmEmail\'");
	requestBodyHandler(contracts.confirmEmail, req, res, 
		function (req, res) {
			emailService.confirmEmail(req.get('Authorization'), req.body, function(err, response, token) {
				if (err) {
					res.send( response );
				}
				else {
					res.set('Authorization', token);
					res.set('Access-Control-Expose-Headers', 'Authorization');
					res.send( response );
				}
			});
		});
});

// Account Endpoints
app.post('/updateForgotPass', jsonParser, function(req, res) {
	logger.info("hit \'updateForgotPass\'");
	requestBodyHandler(contracts.updateForgotPass, req, res, 
		function (req, res) {
			accountService.updateForgotPass(req.get('Authorization'), req.body, function(err, response, token) {
				if (err) {
					res.send( response );
				}
				else {
					res.set('Authorization', token);
					res.set('Access-Control-Expose-Headers', 'Authorization');
					res.send( response );
				}
			});
		});
});
app.post('/changePassword', jsonParser, function(req, res) {
	logger.info("hit \'changePassword\'");
	requestBodyHandler(contracts.changePassword, req, res, 
		function (req, res) {
			accountService.changePassword(req.get('Authorization'), req.body, (response) => res.send(response));
		});
});
app.post('/login', jsonParser, function(req, res) {
	logger.info("hit \'login\'");
	requestBodyHandler(contracts.login, req, res, 
		function (req, res) {
			accountService.login( req.body, function(err, response, token) {
				if (err) {
					res.send( response );
				}
				else {
					res.set('Authorization', token);
					res.set('Access-Control-Expose-Headers', 'Authorization');
					res.send( response );
				}
			});
		});
});
app.post('/createAccount', jsonParser, function (req, res) {
	// TODO: implement createAccount_DEV (no JWT auth)
	if (env.DEV_ENV) {
		logger.info("hit \'createAccount_DEV\'");
		requestBodyHandler(contracts.createAccount_DEV, req, res, 
			function (req, res) {
				accountService.createAccount_DEV(req.get('Authorization'),/* takes no JWT auth, */ req.body, function(err, response, token) {
					if (err) {
						res.send( response );
					}
					else {
						res.set('Authorization', token);
						res.set('Access-Control-Expose-Headers', 'Authorization');
						res.send( response );
					}
				});
			});
	}
	else {
		logger.info("hit \'createAccount\'");
		requestBodyHandler(contracts.createAccount, req, res, 
			function (req, res) {
				accountService.createAccount(req.get('Authorization'), req.body, function(err, response, token) {
					if (err) {
						res.send( response );
					}
					else {
						res.set('Authorization', token);
						res.set('Access-Control-Expose-Headers', 'Authorization');
						res.send( response );
					}
				});
			});
	}
});
app.get('/getUserInfo', jsonParser, function (req, res) {
	logger.info("hit \'getUserInfo\'");
	requestBodyHandler(contracts.getUserInfo, req, res, 
		function (req, res) {
			accountService.getUserInfo(req.get('Authorization'), (response) => res.send(response))
		});
});
app.post('/updateUserInfo', jsonParser, function (req, res) {
	logger.info("hit \'updateUserInfo\'");
	requestBodyHandler(contracts.updateUserInfo, req, res, 
		function (req, res) {
			accountService.updateUserInfo(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/updateGlobalCounters', jsonParser, function (req, res) {
	logger.info("hit \'updateGlobalCounters\'");
	requestBodyHandler(contracts.updateGlobalCounters, req, res, 
		function (req, res) {
			accountService.updateGlobalCounters(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.get('/getAllCounters', jsonParser, function (req, res) {
	logger.info("hit \'getAllCounters\'");
	requestBodyHandler(contracts.getAllCounters, req, res, 
		function (req, res) {
			accountService.getAllCounters(req.get('Authorization'), (response) => res.send(response))
		});
});

// Contact Endpoints
app.post('/createContact', jsonParser, function (req, res) {
	logger.info("hit \'createContact\'");
	requestBodyHandler(contracts.createContact, req, res, 
		function (req, res) {
			contactService.createContact(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/deleteContact', jsonParser, function (req, res) {
	logger.info("hit \'deleteContact\'");
	requestBodyHandler(contracts.deleteContact, req, res, 
		function (req, res) {
			contactService.deleteContact(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.get('/getContactList', jsonParser, function (req, res) {
	logger.info("hit \'getContactList\'");
	requestBodyHandler(contracts.getContactList, req, res, 
		function (req, res) {
			contactService.getContactList(req.get('Authorization'), (response) => res.send(response))
		});
});
app.post('/getContactInfo', jsonParser, function (req, res) {
	logger.info("hit \'getContactInfo\'");
	requestBodyHandler(contracts.getContactInfo, req, res, 
		function (req, res) {
			contactService.getContactInfo(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/updateContactInfo', jsonParser, function (req, res) {
	logger.info("hit \'updateContactInfo\'");
	requestBodyHandler(contracts.updateContactInfo, req, res, 
		function (req, res) {
			contactService.updateContactInfo(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/updateContactStats', jsonParser, function (req, res) {
	logger.info("hit \'updateContactStats\'");
	requestBodyHandler(contracts.updateContactStats, req, res, 
		function (req, res) {
			contactService.updateContactStats(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});

// Activity Endpoints
app.get('/getActivityTypes', jsonParser, function (req, res) {
	logger.info("hit \'getActivityTypes\'");
	requestBodyHandler(contracts.getActivityTypes, req, res, 
		function (req, res) {
			activityService.getActivityTypes(req.get('Authorization'), (response) => res.send(response))
		});
});
app.post('/createActivity', jsonParser, function (req, res) {
	logger.info("hit \'createActivity\'");
	requestBodyHandler(contracts.createActivity, req, res, 
		function (req, res) {
			activityService.createActivity(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/deleteActivity', jsonParser, function (req, res) {
	logger.info("hit \'deleteActivity\'");
	requestBodyHandler(contracts.deleteActivity, req, res, 
		function (req, res) {
			activityService.deleteActivity(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.get('/getActivityList', jsonParser, function (req, res) {
	logger.info("hit \'getActivityList\'");
	requestBodyHandler(contracts.getActivityList, req, res, 
		function (req, res) {
			activityService.getActivityList(req.get('Authorization'), (response) => res.send(response))
		});
});
app.post('/getContactActivities', jsonParser, function (req, res) {
	logger.info("hit \'getContactActivities\'");
	requestBodyHandler(contracts.getContactActivities, req, res, 
		function (req, res) {
			activityService.getContactActivities(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/updateActivity', jsonParser, function (req, res) {
	logger.info("hit \'updateActivity\'");
	requestBodyHandler(contracts.updateActivity, req, res, 
		function (req, res) {
			activityService.updateActivity(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});

// Informational Interview Endpoints
app.get('/getIIScriptQs', jsonParser, function (req, res) {
	logger.info("hit \'getIIScriptQs\'");
	requestBodyHandler(contracts.getIIScriptQs, req, res, 
		function (req, res) {
			iiScriptService.getIIScriptQs(req.get('Authorization'), (response) => res.send(response))
		});
});
app.post('/createIIScriptQ', jsonParser, function (req, res) {
	logger.info("hit \'createIIScriptQ\'");
	requestBodyHandler(contracts.createIIScriptQ, req, res, 
		function (req, res) {
			iiScriptService.createIIScriptQ(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/deleteIIScriptQ', jsonParser, function (req, res) {
	logger.info("hit \'deleteIIScriptQ\'");
	requestBodyHandler(contracts.deleteIIScriptQ, req, res, 
		function (req, res) {
			iiScriptService.deleteIIScriptQ(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/updateIIscript', jsonParser, function (req, res) {
	logger.info("hit \'updateIIscript\'");
	requestBodyHandler(contracts.updateIIscript, req, res, 
		function (req, res) {
			iiScriptService.updateIIscript(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/getContactIIScripts', jsonParser, function (req, res) {
	logger.info("hit \'getContactIIScripts\'");
	requestBodyHandler(contracts.getContactIIScripts, req, res, 
		function (req, res) {
			iiScriptService.getContactIIScripts(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/createIIscript', jsonParser, function (req, res) {
	logger.info("hit \'createIIscript\'");
	requestBodyHandler(contracts.createIIscript, req, res, 
		function (req, res) {
			iiScriptService.createIIscript(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/deleteIIscript', jsonParser, function (req, res) {
	logger.info("hit \'deleteIIscript\'");
	requestBodyHandler(contracts.deleteIIscript, req, res, 
		function (req, res) {
			iiScriptService.deleteIIscript(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});

// Module-related Endpoints
app.get('/getModuleList', jsonParser, function (req, res) {
	logger.info("hit \'getModuleList\'");
	requestBodyHandler(contracts.getModuleList, req, res, 
		function (req, res) {
			moduleService.getModuleList(req.get('Authorization'), (response) => res.send(response))
		});
});
app.get('/getUserModStatus', jsonParser, function (req, res) {
	logger.info("hit \'getUserModStatus\'");
	requestBodyHandler(contracts.getUserModStatus, req, res, 
		function (req, res) {
			moduleService.getUserModStatus(req.get('Authorization'), (response) => res.send(response))
		});
});
app.post('/getModuleContent', jsonParser, function (req, res) {
	logger.info("hit \'getModuleContent\'");
	requestBodyHandler(contracts.getModuleContent, req, res, 
		function (req, res) {
			moduleService.getModuleContent(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});
app.post('/updateMyModules', jsonParser, function (req, res) {
	logger.info("hit \'updateMyModules\'");
	requestBodyHandler(contracts.updateMyModules, req, res, 
		function (req, res) {
			moduleService.updateMyModules(req.get('Authorization'), req.body, (response) => res.send(response))
		});
});

/* --------------- App content endpoint ----------------- */
// specify path for our static content
app.use(express.static(path.join(__dirname, env.path_to_dist)));

// endpoint for static stuff.
app.get('*', (req, res) => {
	logger.info("hit \'%s\'", req.originalUrl);
	res.sendFile(path.join(__dirname, env.path_to_dist+'/index.html'));
});



app.listen(port, () => logger.info('Data Server listening on port #%d...', port))
