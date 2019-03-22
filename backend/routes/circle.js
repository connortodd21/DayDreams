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
var mailer = require('../middleware/mailer')


mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var Circle = require('../model/circle');
var User = require('../model/user')
var DayDream = require('../model/daydream')


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

    let desc = 'A circle ready to go on some trips';
    let url = process.env.DEFAULT_IMAGE;
    if(req.body.description){
        desc = req.body.description
    }
    if(req.body.imageUrl && validate(req.body.imageUrl)){
        url = req.body.imageUrl
    }

    var newCircle = new Circle({
        founder: req.user.username,
        circleName: req.body.circleName,
        description: desc,
        imageUrl: url,
    })

    console.log(newCircle._id)
    newCircle.save().then(() => {
        Circle.findOneAndUpdate({ _id: newCircle._id }, {
            $push: {
                'members': req.user.username,
            }
        }).then((circle) => {
            res.status(200).send(circle)
            return
        }).catch((err) => {
            // console.log(err)
        })
    }).catch((err) => {
            console.log(err)
    })

});

router.post('/add-photo', authenticate, upload.single("image"), function (req, res) {

    if (!req.body || !req.body.circleID || !req.body.imageUrl) {
        res.status(400).send({ message: "Bad Request" })
        return
    }

    if (!validate(req.body.imageUrl)) {
        res.status(400).send({ message: "Invalid image, url is not validated" })
        return
    }

    Circle.findOneAndUpdate({ _id: req.body.circleID }, {
        $set: {
            imageUrl: req.body.imageUrl,
            hasImage: true
        }
    }).then((circ) => {
        Circle.findOne({ _id: req.body.circleID }).then((circle) => {
            if (circle == null) {
                res.status(400).send({ message: "Circle does not exist" })
                return
            }
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

        if (err) {
            res.status(400).send({ message: "Circle does not exist" })
            return
        }

        for (var i = 0; i < circ.members.length; i++) {
            if (circ.members[i] == req.body.username) {
                res.status(400).send({ message: "User is already in circle" })
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

                    User.findEmailByUsername(req.body.username).then((email) => {
                        var emailSubject = "DayDreams: You\'ve Been Added to \"" + circ.circleName + "\"!"
                        var addedToCircleBody = "Dear " + req.body.username + 
                        ",\n\nOne of your friends has added you to " + circ.founder + "\'s circle \"" + circ.circleName + "\". View your profile for more details.\n\n" +
                        "Sincerely, \n\nThe DayDreams Team";

                        mailer(email, emailSubject, addedToCircleBody);

                        res.status(200).send({ message: req.body.username + " added to Circle" })
                    })

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
*   Delete chosen circle
*/
router.post('/delete', authenticate, (req, res) => {

    //ensure that requesthas circleID
    //if not, send bad request
    if (!req.body || !req.body.circleID) {
        // console.log(req.body)
        res.status(400).send({ message: "Bad request" });
        return;
    }

    //find specific Circle object by ID
    //requires circleid to be passed in as a header
    Circle.findByIdAndDelete(req.body.circleID, (err, circ) => {
        if (err || circ == null) {
            res.status(400).send({ message: "Could not find circle" });
            return;
        }
        DayDream.findOneAndDelete({_id: {$in: circ.dayDreams}}).then(() => {
            res.status(200).send(circ) //returns all circle properties
            return
        }).catch((err) => {
            res.send(err);
        })
        // console.log(circ);
    }).catch((err) => {
        res.send(err);
    })
})

/*
*   Edit existing circle
*/
router.post("/edit-name", authenticate, (req, res) => {
    if (!req.body.circleName || !req.body.circleID) {
        res.status(400).json({ message: "Circle name change is incomplete" });
        return;
    }

    Circle.findOne({ _id: req.body.circleID }).then((circ) => {
        if (!circ) {
            res.status(400).json({ message: "Circle does not exist" });
            return;
        }
        Circle.findOneAndUpdate({ _id: req.body.circleID },
            {
                $set: {
                    circleName: req.body.circleName,
                }
            }).then(() => {
                res.status(200).send({ message: 'Circle name updated!' })
                return
            }).catch((err) => {
                res.send(err);
            })
    })
})

router.post('/add-message', authenticate, (req, res) => {
    if(!req.body || !req.body.message || !req.body.circleID){
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Circle.findOne({_id: req.body.circleID}).then((circle) => {
        if(!circle){
            res.status(400).send({message: "Circle does not exist"})
            return
        }
        Circle.findOneAndUpdate({_id: req.body.circleID}, {
            $push: {
                chat: {
                    message: req.body.message,
                    user: req.user.username
                }
            }
        }).then((circ) => {
            res.status(200).send({message: "message added"})
            return
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})


/*
*   Edit existing circle circle description
*/
router.post("/edit-circle-description", authenticate, (req, res) => {
    if (!req.body.circleDescription || !req.body.circleID) {
        res.status(400).json({ message: "Circle description change is incomplete" });
        return;
    }

    Circle.findOneAndUpdate({ _id: req.body.circleID },
        {
            $set: {
                description: req.body.circleDescription,
            }
        }).then(() => {
            res.status(200).send({ message: 'Circle description updated!' })
            return
        }).catch((err) => {
            res.send(err);
        })
})

router.post('/leave', authenticate, (req, res) => {
    if(!req.body.circleID){
        res.status(400).json({ message: "Circle description change is incomplete" });
        return;
    }
    Circle.findOne({_id: req.body.circleID}).then((circ) => {
        if(!circ){
            res.status(400).send({message: "Circle does not exist"})
            return
        }
        Circle.findOneAndUpdate({_id: req.body.circleID}, {
            $pull: {
                members: req.user.username
            }
        }).then(() => {
            res.status(200).send({ message: username + " has left circle"})
            return
        }).catch((err) => {
            res.send(err);
            return
        })
    }).catch((err) => {
        res.send(err);
        return
    })
})

/*
*   Get all members in a circle
*/
router.get('/all-members', authenticate, (req, res) => {
    if (!req.body || !req.body.circleid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Circle.findById(req.body.circleid, (err, circ) => {
        res.status(200).send(circ.members)
    }).catch((err) => {
        res.status(400).send({ message: "Could not find circle" });
        return;
    })
})

router.get('/chat', authenticate, (req, res) => {
    if (!req.headers.circleid) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Circle.findById(req.headers.circleid, (err, circ) => {

        if (err || circ == null) {
            res.status(400).send({ message: "Could not find circle" });
            return;
        }
        res.status(200).send(circ.chat) //returns all circle properties
        return
        // console.log("success in returning circle properties");
    })
})

/*
*   Get circle info
*/
router.get('/info', authenticate, (req, res) => {

    //ensure that request has body and has circleID
    //if not, send bad request
    if (!req.headers.circleid) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }

    //find specific Circle object by ID
    //requires circleid to be passed in as a header
    Circle.findById(req.headers.circleid, (err, circ) => {

        if (err || circ == null) {
            res.status(400).send({ message: "Could not find circle" });
            return;
        }
        res.status(200).send(circ) //returns all circle properties
        return
        // console.log("success in returning circle properties");
    })
    //to get circle info of a specific circle
    //use ID

    // make sure ID
})


router.get('/all-daydreams', authenticate, (req, res) => {

    if (!req.headers.circleid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Circle.findOne({ _id: req.headers.circleid }).then((circ) => {
        if (circ == null) {
            res.status(400).send({ message: "Could not find circle" });
            return;
        }
        DayDream.find({ _id: { $in: circ.dayDreams }, completed: false }).then((dd) => {
            if (dd == null) {
                res.status(400).send({ message: "Could not find any daydreams" });
                return;
            }
            res.status(200).send(dd)
            return
        }).catch((err) => {
            res.send(err)
            return
        })
    }).catch((err) => {
        res.send(err)
        return
    })
})

router.get('/all-memories', authenticate, (req, res) => {

    if (!req.headers.circleid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    Circle.findOne({ _id: req.headers.circleid }).then((circ) => {
        if (circ == null) {
            res.status(400).send({ message: "Could not find circle" });
            return;
        }
        DayDream.find({ _id: { $in: circ.dayDreams }, completed: true }).then((dd) => {
            if (dd == null) {
                res.status(400).send({ message: "Could not find any daydreams" });
                return;
            }
            res.status(200).send(dd)
            return
        }).catch((err) => {
            res.send(err)
            return
        })
    }).catch((err) => {
        res.send(err)
        return
    })
})

module.exports = router;
