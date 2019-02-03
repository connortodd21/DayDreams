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
var Circle = require('../model/circle');
var User = require('../model/user')


/**
* All circle related routes
*/
router.get("/", function (req, res) {
    res.send('This router is for all circle related tasks');
})

router.post("/add", authenticate, function (req, res) {
    b
    if (!req.body || !req.body.circleName) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }
    var newCircle = new Circle ({
        founder: req.user.username,
        circleName: req.body.circleName,
    })
    
    newCircle.save().then(() => {
        Circle.findOneAndUpdate({circleName: req.body.circleName}, {
            $push: {
                'members': req.user.username,
            }
        }).then((circle) => {
            res.status(200).send(circle)
            return
        }).catch((err) => {
            console.log(err)
        })
    })

});

module.exports = router;

