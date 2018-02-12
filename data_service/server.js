var express = 			require('express');
var bodyParser = 		require('body-parser');
var authService = 	require('./authService');
var path = 				require('path'); // for serving static content
var accountService = require('./accountService');
var contactService = require('./contactService');

var app = express();
var jsonParser = bodyParser.json({"type":"application/json"});
var port = 3002;



// CORS (needed for local testing... that's all. Right?)
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


/*-----------------------------------------------------
 Endpoints
 -----------------------------------------------------*/

// LOG IN
// EXPECTS: body: {email:"", password:""}
// RETURNS: header: Authorization: "<token>", body: { what else??? }
app.post('/login', jsonParser, function (req, res) {
	  console.log("\t endpoint: login()");
	  if (!req.body) {
		  console.log("\t error in request body")
		  // TODO: when/why !req.body == false? Do we need to send responses
		  return res.sendStatus(400);
	  }
	  else {
		  accountService.login( req.body, function(token, err) {
			  res.set('Authorization', token);
			  res.set('Access-Control-Expose-Headers', 'Authorization');
			  res.send("Login Successful!!!");
		  });
	  }
  }
);

/*
// CREATE ACCOUNT
// EXPECTS: body: {acct_info : {email:"", password:""}, stripe_token? : <???> }
// RETURNS: same as LOG IN...?
app.post('/createAccount', jsonParser, function (req, res) {
  
  console.log("\t endpoint: createAccount()");
  
  if (!req.body){
	  console.log("\t error in request body")
	  return res.sendStatus(400);
  }
  
  else{
		// console.log("~~~~~~ Request Body ~~~~~~");
		// console.log(JSON.stringify(req.body));
		// res.send("Thanks!!!");
		
		accountService.createAccount(req.body, (result) => res.send(result));
	}
});
*/

// GET CONTACT LIST
// EXPECTS:
// RETURNS:
app.get('/getContactList', jsonParser, function (req, res) {
	console.log("\t endpoint: getContactList()");
	if (!req.body){
		console.log("\t error in request body")
		return res.sendStatus(400);
	}
	else{		
		contactService.getContactList(req.get('Authorization'), (result) => res.send(result));
	}
});


// getContactInfo – return info on one contact
// getContactActivities – Return all activities on one contact
// editContactInfo
// addActivity
// editActivity
// removeActivity
// createInfoScript
// deleteInfoScript
// deleteContact

// getAllActivities – For each contact return getContactActivities

// GET MODULE LIST
// GET MODULE
// GET PROFILE
// UPDATE NOTIFICATION EMAIL
// CHANGE PASSWORD
// 


/* --------------- App content endpoint ----------------- */
// specify path for our static content
app.use(express.static(path.join(__dirname, 'public')));

// endpoint for static stuff.
app.get('*', (req, res) => {
	console.log("  hit app stuff...");
	res.sendFile(path.join(__dirname, 'public/index.html'));
});



app.listen(port, () => console.log('Data Server listening on port #'+port+'...'))


/* HTTPS options/stuff. Ignore for now...

var https = require('https');
var fs = require('fs');

var options = {
    key: fs.readFileSync('<...path to .pem file...>'),
    cert: fs.readFileSync('<...path to .pem file...>'),
    ca: fs.readFileSync('<...path to .pem file...>')
};

var httpsServer = https.createServer(options, app);
httpsServer.listen(port);

*/
