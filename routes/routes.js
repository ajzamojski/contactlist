//required dependencies
require('dotenv').config();
const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const Contact = require('../model/contactSchema');


//cloudinary configuration for sending images to cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

// router.get('/', (req, res) => {
// 	res.sendFile('../index.html')
// })

//this route retrieves all our contacts from the db and sorts it by first name
router.get('/apicontacts', (req, res, next) => {
	Contact.find().sort({firstName: 1}).exec((err, items) => {
		if (err) {
			res.json(err)
		}
		else {
			res.json(items);
		}
	});
});

//route returns one particular contact by the id number, used for editing the contact
router.get('/findcontact/:id', (req, res, next) => {
	Contact.find({"_id": req.params.id}).exec((err, item) => {
		if (err) {
			res.json(err)
		}
		else {
			res.json(item);
		}
	});
});

// post for submitting a new contact with multer holding the image in a buffer state
router.post('/newcontact', upload.single('myFile'), (req, res, next) => {
	let entry = {
		firstName: jsUcfirst(req.body.firstName),
		lastName: jsUcfirst(req.body.lastName),
		email: req.body.email,
		dob: req.body.dob,
		phone: req.body.phone,
		profilePic: "",
		groups: JSON.parse(req.body.groups),
		comments: req.body.comments
	}
	// function to uppercase first letter of name for sorting purposes
	function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
	}

	console.log(entry);
	console.log("my picture file...");
	console.log(req.file);
	/*if the file object exists and a picture was uploaded send it to cloudinary
	and return the url to send to mongodb
	*/ 
	if (req.file && entry.firstName.length > 0 && entry.lastName.length > 0) {
		console.log("req file exists..")
			let fileToUpload = req.file.buffer;
		cloudinary.v2.uploader.upload_stream({resourse_type: 'raw'}, (error, result) => {
			console.log("cloudinary result..");
			console.log(result);
			if (result != "undefined") {
				entry.profilePic = result.secure_url;
			}

	  console.log("was profile picture url uploaded?...");
	  console.log(entry);
					console.log("in .then function...")
				  let newContact = new Contact(entry);
			  	console.log(newContact);
					newContact.save((err) => {
						if (err) {
							res.json(err).end(req.file.buffer);
						}
						else {
							res.json({msg: "contact has been successfully saved to the DB"}).end(req.file.buffer);
						}
					});
		}).end(req.file.buffer)

	}
	//if file/picture was not uploaded by the individual send other info to DB
	else if (!req.file) {
	  let newContact = new Contact(entry);
	  console.log(newContact);
		newContact.save((err) => {
			if (err) {
				res.json(err);
			}
			else {
				res.json({msg: "contact has been successfully saved to the DB"});
			}
		});
	}
});

//put for updating existing contact with new fields
router.put('/contact/:id', upload.single('myFile'), (req, res, next) => {
	let updateContact = {
		firstName: jsUcfirst(req.body.firstName),
		lastName: jsUcfirst(req.body.lastName),
		email: req.body.email,
		phone: req.body.phone,
		profilePic: req.body.profilePic,
		dob: req.body.dob,
		groups: JSON.parse(req.body.groups),
		comments: req.body.comments
	}
	console.log("these are comments...")
	console.log(req.body);
	console.log(updateContact);

	// function to uppercase first letter of name for sorting purposes
	function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
	}
		/*if the file object exists and a picture was uploaded and first + last
		names were not empty send it to cloudinary and return the url
		to send to mongodb */ 
		if (req.file && updateContact.firstName.length > 0 && updateContact.lastName.length > 0) {
		console.log("req file exists..")
			let fileToUpload = req.file.buffer;
		cloudinary.v2.uploader.upload_stream({resourse_type: 'raw'}, (error, result) => {
			console.log("cloudinary result..");
			console.log(result);
			if (result != "undefined") {
				updateContact.profilePic = result.secure_url;
			}

	  console.log("was profile picture url uploaded?...");
	  console.log(updateContact);
	  	Contact.findOneAndUpdate({ _id: req.params.id }, { $set:  updateContact})
				.exec((err, results) => {
				if (err) {
					res.json(err).end(req.file.buffer);
				}
				else {
					console.log("updated contact");
					res.json(results).end(req.file.buffer);
				}
			});
		}).end(req.file.buffer);
	}
		//if file/picture was not uploaded by the individual send other info to DB
	else if (!req.file) {
	  	Contact.findOneAndUpdate({ _id: req.params.id }, { $set:  updateContact})
				.exec((err, results) => {
				if (err) {
					res.json(err);
				}
				else {
					console.log("updated contact");
					res.json(results)
				}
		});

	}

});

//routed used to delete contact by id
router.delete('/deletecontact/:id', (req, res, next) => {
	Contact.remove({_id: req.params.id}, (err, result) => {
		if (err) {
			res.json(err);
		}
		else {
			res.json(result)
		}
	});
});

router.post('/newroutecontactform', upload.single('myFile'), (req, res, next) => {


	console.log(req.body)
	console.log("our file..........")
	console.log(req.file);
});

module.exports = router;