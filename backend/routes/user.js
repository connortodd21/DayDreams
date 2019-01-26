var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');

/**
 * All user related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all user related tasks');
});

/*
 * Register new user 
 */
router.post("/register", (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username || !req.body.age) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    var verificatonCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    // User Data
    var newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        verified: false,
        verificationNum: verificatonCode,
    });


    //Add to database w/o auth
    newUser.save().then(() => {
        res.status(200).send(newUser)
    })
/*
    // Add to database with auth
    newUser.save().then(() => {
        return newUser.generateAuthToken();
    }).then((token) => {
        res.header('token', token).header('verificationNum', verificatonCode).send(newUser);
    }).catch((err) => {
        res.status(400).send(err)
        return;
    })
*/
});

module.exports = router;