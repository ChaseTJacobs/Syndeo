/*
	This file provides functions for easier access to static content in our 
	database, i.e. Modules, Activity Types, & IIScriptQ's(TODO)
	Here's a list of them and what they expect:	
	
	createModule - expects filename where module object is located.
	
	editModule - same as createModule...
	
	createActType - string of the new activity type
	
	editActType -  string of the old activity type you want to overwrite, and
		string of the new activity type.
	
	add_iiScriptQ - TODO
	
	delete_iiScriptQ - TODO
	
*/

var dbService = require('../dbService');
var fs = require("fs");


// Modules
createModule = function(filename){
	var mod_str = fs.readFileSync(filename, "utf8");
	var mod_obj = {};
	try {
		mod_obj = JSON.parse(mod_str);

		dbService.query(
			"INSERT INTO modules(module_name, module_number, module_description, module_content) VALUES(?,?,?,?)",
			[mod_obj.moduleName, mod_obj.moduleNumber, null/*replace with "mod_obj.description"*/, mod_str],
			function(err, query_result) {
				if (err || query_result.affectedRows < 1) {
					console.log(JSON.stringify(err));
				}
				else {
					console.log("Successfully created a Module...");
					return; // ?
				}
			}
		);
		
	} catch (exception) {
		console.log("Error parsing file content into JSON:")
		console.log(JSON.stringify(exception));
	}
	
}
editModule = function(filename){
	var mod_str = fs.readFileSync(filename, "utf8");
	var mod_obj = {};
	try {
		mod_obj = JSON.parse(mod_str);
		
		dbService.query(
			"UPDATE modules SET module_content=? WHERE modules.module_number =?;",
			[mod_str, mod_obj.moduleNumber],
			function(err, rows) {
				if (err) {
					console.log(JSON.stringify(err));
				}
				else {
					console.log("Successfully updated a Module...");
					return; // ?
				}
			}
		);
		
	} catch (exception) {
		console.log("Error parsing file content into JSON:")
		console.log(JSON.stringify(exception));
	}
	
}
// Activity Types
createActType = function(activity_type){
	if (!(typeof "string" === typeof activity_type)) {
		console.log("ERROR in createActType: expected a String value.");
	} else {
		dbService.query(
			"INSERT INTO activity_types(activity_type) VALUES(?)",
			[activity_type],
			function(err, query_result) {
				if (err || query_result.affectedRows < 1) {
					console.log(JSON.stringify(err));
				}
				else {
					console.log("Successfully added a new Activity Type...");
					return; // ?
				}
			}
		);
	}
}
editActType = function(old_atype, new_atype){
	if (!(typeof "string" === typeof old_atype) ||
		 !(typeof "string" === typeof new_atype)) {
		console.log("ERROR in createActType: expected a String value.");
	} else {
		dbService.query(
			"UPDATE activity_types SET activity_type =? WHERE activity_types.activity_type =?;",
			[new_atype, old_atype],
			function(err, query_result) {
				if (err || query_result.affectedRows < 1) {
					console.log(JSON.stringify(err));
				}
				else {
					console.log("Successfully updated an Activity Type...");
					return; // ?
				}
			}
		);
	}
}
// Default Informational Interview Script Questions
/*
add_iiScriptQ = function(question){
	// TODO
}
delete_iiScriptQ = function(id){
	// TODO
}
*/

/*
	To use, just call the desired function below, giving the appropriate
	parameters.
	
*/
