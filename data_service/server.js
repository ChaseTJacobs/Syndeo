var express = 			require('express');
var bodyParser = 		require('body-parser');
var authService = 	require('./authService');
var path = 				require('path'); // for serving static content
var accountService = require('./accountService');
var contactService = require('./contactService');
var env = 				require('./environment');

var app = express();
var jsonParser = bodyParser.json({"type":"application/json"});
var port = 3001;



// CORS (needed for local testing... that's all. Right?)
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


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

// LOG IN
// EXPECTS: body: {email:"", pass:""}
// RETURNS: header: new JWT, body: {data: {user info} }
app.post('/login', jsonParser, function (req, res) {
	  console.log("\t endpoint: login()");
	  if (!req.body) {
		  console.log("\t error in request body")
		  // TODO: when/why !req.body == false? Do we need to send responses
		  //return res.sendStatus(400);
		  res.send({'error':"problem in Request Body"});
	  }
	  else {
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
	  }
  }
);


// CREATE ACCOUNT
// EXPECTS: body: {email:"", pass:"", userInfo:"{}"}
// RETURNS: header: new JWT, body: {data: {user info} }
app.post('/createAccount', jsonParser, function (req, res) {
  
  console.log("\t endpoint: createAccount()");
  
  if (!req.body){
	  console.log("\t error in request body")
	  return res.sendStatus(400);
  }
  else {
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
	  }
});


// GET CONTACT LIST
// EXPECTS: header: JWT
// RETURNS: body: {data: [{contact},{contact}...] }
app.get('/getContactList', jsonParser, function (req, res) {
	console.log("\t endpoint: getContactList()");
	if (!req.body){
		console.log("\t error in request body")
		return res.sendStatus(400);
	}
	else{		
		contactService.getContactList(req.get('Authorization'), (response) => res.send(response));
	}
});


// CREATE CONTACT
// EXPECTS: header: JWT, body: { all kindsa contact informations }
// RETURNS: body: {data:"success message?"}
app.post('/createContact', jsonParser, function (req, res) {
	console.log("\t endpoint: createContact()");
	if (!req.body){
		console.log("\t error in request body")
		return res.sendStatus(400);
	}
	else{		
		contactService.createContact(req.get('Authorization'), req.body, (response) => res.send(response));
	}
});


/* --------------- App content endpoint ----------------- */
// specify path for our static content
app.use(express.static(path.join(__dirname, env.path_to_dist)));

// endpoint for static stuff.
app.get('*', (req, res) => {
	console.log("  hit app stuff with URL: " + req.originalUrl);
	res.sendFile(path.join(__dirname, env.path_to_dist+'/index.html'));
});



app.listen(port, () => console.log('Data Server listening on port #'+port+'...'))
