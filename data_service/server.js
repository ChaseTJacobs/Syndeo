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
 -----------------------------------------------------*/

// LOG IN
// EXPECTS: body: {email:"", pass:""}
// RETURNS: header: new JWT, body: { what else??? }
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
// EXPECTS: body: {email:"", password:"", userInfo:"{}"}
// RETURNS: header: new JWT, body: { what else??? }
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




// MAKE PAYMENT
// EXPECTS: header: JWT, body: {stripeToken:<???>}
// RETURNS: body: {message:"???"}



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
app.use(express.static(path.join(__dirname, env.path_to_dist)));

// endpoint for static stuff.
app.get('*', (req, res) => {
	console.log("  hit app stuff with URL: " + req.originalUrl);
	res.sendFile(path.join(__dirname, env.path_to_dist+'/index.html'));
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
