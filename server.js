// Server file and its dependacies to start server and MongoDB
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const apiRoute = require('./routes/routes');


const app = express();

const PORT = process.env.PORT || 3000;

// set up mongoose enviornment and connect to contactlist DB
mongoose.Promise = Promise;
const databaseUri = "mongodb://localhost/contactlist";
const db = mongoose.connection;

if (process.env.MONGODB_URI) {
	mongoose.connect(process.env.MONGODB_URI)
}
else {
	mongoose.connect(databaseUri);
}
// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// express middleware in use and routes for our api
app.use(cors());
app.use(bodyParser.urlencoded({extended:true})) 
app.use(bodyParser.json());
// app.use('/', apiRoute);
require('./routes/routes')(app);

app.use(express.static(__dirname + '/dist'));
app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// start server here
app.listen(PORT, () => {
	console.log("Server has started on port " + PORT);
});

