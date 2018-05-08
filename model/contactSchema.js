const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({

	firstName: {
		type: String,
		required: true
	},

	lastName: {
		type: String,
		required: true
	},

	email: {
		type: String,
		required: true
	},

	phone: {
		type: String
	},

	profilePic: {
		type: String
	},

	dob: {
		type: String
	},

	groups: [{
		type: String
	}],

	comments: {
		type: String
	}

});

const Contact = mongoose.model('contact', contactSchema);
module.exports = Contact;