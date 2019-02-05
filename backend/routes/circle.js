var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var authenticate = require('../middleware/authenticate')
var multer = require("multer");
var cloudinary = require("cloudinary");
var cloudinaryStorage = require("multer-storage-cloudinary");
var upload = require('../middleware/photo_upload')
var validate = require('../middleware/validate_url')


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

    if (!req.body || !req.body.circleName) {
        res.status(400).send({ message: "Circle data is incomplete" });
        return;
    }
    var newCircle = new Circle({
        founder: req.user.username,
        circleName: req.body.circleName,
    })

    newCircle.save().then(() => {
        Circle.findOneAndUpdate({ circleName: req.body.circleName }, {
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

router.post('/add-photo', authenticate, upload.single("image"), function (req, res) {

    if (!req.body || !req.body.circleName || !req.body.imageUrl) {
        res.status(400).send({ message: "Bad Request" })
        return
    }

    if (!validate(req.body.imageUrl)) {
        res.status(400).send({ message: "Invalid image, url is not validated" })
        return
    }

    Circle.findOneAndUpdate({ circleName: req.body.circleName }, {
        $set: {
            imageUrl: req.body.imageUrl,
            hasImage: true
        }
    }).then((circ) => {
        Circle.findOne({ circleName: req.body.circleName }).then((circle) => {
            res.status(200).send(circle)
            return
        }).catch((err) => {
            res.send(err)
            return
        })
    }).catch((err) => {
        res.status(400).send("Circle does not exist")
        return
    })
});

router.post('/add-user', authenticate, (req, res) => {

    if (!req.body || !req.body.username || !req.body.circleID) {
        res.status(400).send("Bad request")
        return
    }

    Circle.findById(req.body.circleID, (err, circ) => {

        if(err){
            res.status(400).send({message: "Circle does not exist"})
            return
        }

        for (var i = 0; i < circ.members.length; i++) {
            if (circ.members[i] == req.body.username) {
                res.send({message: "User is already in circle"})
                return
            }
        }

        User.findOne({ username: req.body.username }).then((user) => {

            if (!user) {
                res.status(400).send({ message: "Username does not exist" });
                return;
            }

            Circle.findOneAndUpdate({ _id: req.body.circleID }, {
                $push: {
                    members: req.body.username,
                }
            }).then(() => {
                Circle.findOneAndUpdate({ _id: req.body.circleID }, {
                    $inc: {
                        numberOfPeople: 1
                    }
                }).then(() => {
                    res.status(200).send({ message: req.body.username + " added to Circle" })
                    return
                }).catch((err) => {
                    res.status(400).send(err);
                    return;
                })
            }).catch((err) => {
                res.status(400).send(err);
                return;
            })
        }).catch((err) => {
            res.send(err);
            return;
        })

    })
})

/*
*   Get all members in a circle
*/
router.get('/all-members', authenticate, (req, res) => {
    if (!req.body || !req.body.circleID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Circle.findById(req.body.circleID, (err, circ) => {
        res.status(200).send(circ.members)
    }).catch((err) => {
        res.status(400).send({ message: "Could not find circle" });
        return;
    })
})


module.exports = router;

