var env = 	require('../environment');
var logger = require('winston');
var stripe = require("stripe")(env.stripe_API_key);

// Charge the user's card:

exports.make_oneTime_payment = function(user_email, stripe_token, callback){
	logger.info("paymentService.make_oneTime_payment: charging %s, using token %s", user_email, stripe_token);
	stripe.charges.create(
	{
		amount: env.registration_fee,
		currency: "usd",
		description: "Welcome! You've Successfully Registered with Joyful Networking.",
		source: stripe_token,
		receipt_email: user_email,
	},
	callback);
}

