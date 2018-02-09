var db = require("./dbService");
var authService = 	require('./authService');


/* GET CONTACT LIST:
	1) authenticate token
	2) 
	3) 
	4) 
*/
exports.getContactList = function(req_auth_header, callback){
	console.log("\t\t IN contSrv.getContactList: ");
	console.log("\t\t req auth header: "+req_auth_header);
	
	authService.verifyToken(req_auth_header, function(error, decoded_token) {
		if (error) {
			console.log("\t\t a token auth error happened... ");
			callback(error);
		}
		else {
			// TODO: extract user_ID & email from decoded token
			// TODO: DB access...
			
			// return dummy data for now
			callback({ 
				"contacts" : [
					{"id":1, "name":"Bob", "org":"CoolPeeps Inc."},
					{"id":2, "name":"Bill", "org":"CoolPeeps Inc."},
					{"id":3, "name":"Tim", "org":"CoolPeeps Inc."}
			]});
		}
	});
}

