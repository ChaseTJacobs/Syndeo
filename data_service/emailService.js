var env = 				require('./environment');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(env.sendGrid_API_key);
const msg = {
  'to': 'nathanulmer@gmail.com',//'chasetjacobs2@gmail.com',
  'from': 'nathanulmer@gmail.com',
  'subject': 'sendGrid test email',
  'text': 'Did you know I\'m pretty cool?',
  'html': '<h1>Cause I am.</h1>',
};
sgMail.send(msg);

/*
	We'll be sending emails for forgotten passwords, payment confirmations, and successful registration.
*/