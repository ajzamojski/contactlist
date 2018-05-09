const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({

	firstName: {
		type: String,
		required: [true, 'First Name is required']
	},

	lastName: {
		type: String,
		required: [true, 'Last Name is required']
	},

	email: {
		type: String,
		required: [true, 'Email is required']
	},

	phone: {
		type: String,
    minlength: 10,
    maxlength: 10,
    required: [true, 'Phone is required']
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