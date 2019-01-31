var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var authenticate = require('../middleware/authenticate')

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var circle = require('../model/circle');


/**
* All circle related routes
*/
router.get("/", function(req, res){
    res.send('This router is for all circle related tasks');
})

router.post("/add", authenticate, function(req,res){
       //code to create a new circle
       //look at the register function in user.js for an example
       //req is the request (from postman or from the frontend)
       //res is the response to return. HTTP request and response like the 252 lab
});

module.exports = router;

