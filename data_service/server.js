var express = 			require('express');
var app = express();

var bodyParser = 		require('body-parser');
var jsonParser = bodyParser.json({"type":"application/json"});

var path = 				require('path'); // for serving static content
var logger = 			require('winston');
// logger.add(logger.transports.File, { filename: 'combined.log' });
logger.add(logger.transports.File, {
	filename: 'combined.log',
	handleExceptions: true,
	humanReadableUnhandledException: true
});
logger.exitOnError = false;

var authService = 	require('./authService');
var accountService = require('./accountService');
var contactService = require('./contactService');
var contracts = 		require('./contracts');
var env = 				require('./environment');

var port = 3001;



// CORS (needed for local testing... that's all. Right?)
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

requestBodyHandler = function(contract, req, res, callback) {
	if (!req.body) {
			return res.sendStatus(400);
	}
	else {
		contracts.enforce(req, contract, function(err, err_obj, req) {
			if (err) {
				logger.warn("bodyHandler, error: ", err_obj.data);
				res.send(err_obj);
			}
			else {
				logger.info("bodyHandler, OK.")
				callback(req, res);
			}
		});
	}
}

/*-----------------------------------------------------
Endpoints
- Deleting & Updating ANYTHING should require validation of the user-to-whateverobject relationship

	Account endpoints:
	- login
	- createAccount
	- updateUserInfo
	- forgotPassword
	- getUserInfo ???
	- makePayment ???

	NRM endpoints:
	- createContact
	- createActivity
	- createIIscript
	- getContactList
	- getContactInfo // includes numbers
	- getContactActivities
	- getContactIIScripts
	- getIIScriptQs
	- updateContactInfo(c_id) // includes numbers
	- updateActivity(a_id)
	- updateContactIIScript(script_id)
	- deleteContact(c_id)
	- deleteActivity(a_id)
	- deleteIIScript(script_id)

	Module endpoints:
	- getModuleList
	- getModuleContent
	- updateMyModules

	Calendar endpoints:
	- getActivityList

	Stats endpoints:
	- getAllCounters
	- updateGlobalCounters

-----------------------------------------------------*/

app.post('/login', jsonParser, function(req, res) {
	logger.info("hit \'login\', ipa: %s", req.ip);
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
	logger.info("hit \'createAccount\', ipa: %s", req.ip);
	requestBodyHandler(contracts.createAccount, req, res, 
		function (req, res) {
			accountService.createAccount( req.body, function(err, response, token) {
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


app.get('/getContactList', jsonParser, function (req, res) {
	logger.info("hit \'getContactList\', ipa: %s", req.ip);
	requestBodyHandler(contracts.getContactList, req, res, 
		function (req, res) {
			contactService.getContactList(req.get('Authorization'), (response) => res.send(response))
		}
	);
});


app.post('/createContact', jsonParser, function (req, res) {
	logger.info("hit \'createContact\', ipa: %s", req.ip);
	requestBodyHandler(contracts.createContact, req, res, 
		function (req, res) {
			contactService.createContact(req.get('Authorization'), req.body, (response) => res.send(response))
		}
	);
});


/* --------------- App content endpoint ----------------- */
// specify path for our static content
app.use(express.static(path.join(__dirname, env.path_to_dist)));

// endpoint for static stuff.
app.get('*', (req, res) => {
	console.log("  hit app stuff with URL: " + req.originalUrl);
	res.sendFile(path.join(__dirname, env.path_to_dist+'/index.html'));
});



app.listen(port, () => logger.info('Data Server listening on port #%d...', port))
