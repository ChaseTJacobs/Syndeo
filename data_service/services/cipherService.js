var env = require('../environment');
var crypto = require('crypto');
var logger = require('winston');

exports.encrypt = function(plain_text, callback) {
	// here we assume input of strings or JSON. NO OTHER TYPES.
	if (!(typeof plain_text === typeof "string"))
		plain_text = JSON.stringify(plain_text); // potential decrypt failure due to non-determinism of JSON.stringify()!!!
	// logger.info("encrypt: plain text = %s", plain_text);
	try {
		var cipher = crypto.createCipher(env.DB_encrypt_algo, env.DB_encrypt_secret);
		let encrypted = cipher.update(plain_text, 'utf8', 'hex');
		encrypted += cipher.final('hex');
		// logger.info("encrypt: encrypted = %s", encrypted);
		callback(null, encrypted);
	} catch (error) {
		logger.error("cipherService.encrypt: error trying to encrypt: ", error);
		callback(error, null);
	}
}
exports.decrypt = function(cipher_text, callback) {
	// logger.info("decrypt: cipher_text = %s", cipher_text);
	try {
		var decipher = crypto.createDecipher(env.DB_encrypt_algo, env.DB_encrypt_secret);
		let decrypted = decipher.update(cipher_text, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		// logger.info("decrypt: decrypted = %s", decrypted);
		callback(null, decrypted);
	} catch (error) {
		logger.error("cipherService.decrypt: error trying to decrypt: ", error);
		callback(error, null);
	}
}
