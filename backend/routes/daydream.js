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
var DayDream = require('../model/daydream')

/**
 * All user related routes
 */
router.get("/", function (req, res) {
    res.send('This route is for all user related tasks');
});

function isInt(value) {
    var x;
    if (isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

router.post('/add', authenticate, (req, res) => {
    if (!req.body || !req.body.circleID || !req.body.destination || !req.body.description || !req.body.totalCost) {
        res.status(400).send({ message: "DayDream data is incomplete" });
        return;
    }
    var newDayDream = new DayDream({
        circleID: req.body.circleID,
        destination: req.body.destination,
        description: req.body.description,
        totalCost: req.body.totalCost,
    })

    if (!isInt(req.body.totalCost)) {
        res.status(400).send({ message: "Error: Make sure that totalCost is an integer" });
        return;
    }

    Circle.findOneAndUpdate({ _id: req.body.circleID }, {
        $push: {
            dayDreams: newDayDream._id
        }
    }).then((circ) => {
        if (circ == null) {
            //no circle found{}
            res.status(400).send({ message: "Circle doesn't exist" });
            return;
        }
        newDayDream.save().then(() => {
            res.status(200).send(newDayDream)
            return
        }).catch((err) => {
            //   console.log(req.body);
            res.status(400).send(err)
            return;
        })
        //works
    }).catch((err) => {
        res.send(err);
        // console.log(req);
        return;
    })


})

/*
*   Delete chosen DayDream
*/
router.post('/delete', authenticate, (req, res) => {

    //ensure that requesthas circleID and daydreamID
    if (!req.body || !req.body.daydreamID) {
        // console.log(req.body)
        res.status(400).send({ message: "Bad request" });
        return;
    }

    //find specific DayDream object by ID and delete
    DayDream.findByIdAndDelete(req.body.daydreamID, (err, dream) => {
        if (err || dream == null) {
            res.status(400).send({ message: "Could not find Dream" });
            return;
        }
        // res.status(200).send(dream) //returns all circle properties
        // console.log(dream);
    }).catch((err) => {
        res.status(400).send(err);
        return;
    }).then(() => {
        res.status(200).send({ message: "Daydream Removed!" })
        return;
    })
})


router.post('/upload-photo', authenticate, upload.single("image"), (req, res) => {
    // console.log(req)
    if (!req.file.url || !req.file.public_id || !req.headers.daydreamid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findOneAndUpdate({ _id: req.headers.daydreamid }, {
        $push: {
            images: {
                url: req.file.url,
                id: req.file.public_id
            }
        }
    }).then((dd) => {
        // console.log(dd)
        res.status(200).send({ message: "Photo successfully uploaded" })
        return
    }).catch((err) => {
        res.send(err);
    })
})

router.post("/edit-daydream", authenticate, (req, res) => {
    if (!req.body.destination || !req.body.daydreamID) {
        res.status(400).json({ message: "Daydream change is incomplete" });
        return;
    }

    DayDream.findOneAndUpdate({ _id: req.body.daydreamID },
        {
            $set: {
                destination: req.body.destination,
            }
        }).then(() => {
            res.status(200).send({ message: 'Circle name updated!' })
            return
        }).catch((err) => {
            res.send(err);
        })
})

router.get('/info', authenticate, (req, res) => {

    //if not, send bad request
    if (!req.headers.daydreamid) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findById(req.headers.daydreamid, (err, dd) => {

        if (err) {
            res.status(400).send({ message: "Could not find daydream" });
            return;
        }
        res.status(200).send(dd) //returns all circle properties
    }).catch((err) => {
        res.status(400).send(err);
        return;
    })
    //to get circle info of a specific circle
    //use ID

    // make sure ID
})

router.get('/all-photos', authenticate, (req, res) => {
    if(!req.headers.daydreamid){
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findById(req.headers.daydreamid, (err, dd) => {

        if (err) {
            res.status(400).send({ message: "Could not find daydream" });
            return;
        }
        res.status(200).send(dd.images) //returns all circle properties
        // console.log(dd.images)
    }).catch((err) => {
        res.status(400).send(err);
        return;
    }).then(() => {
        res.status(200).send({ message: "Daydream Removed!" })
        return;


        /*Circle.findOne({ _id: req.body.circleID }).then((circ) => {
            if (circ == null) {
                res.status(400).send({ message: "Could not find circle" });
                return;
            }
            let temp = [];
            for (var i = 0; i < circ.dayDreams.length; i++) {
                if (circ.dayDreams[i] != req.body.daydreamID) {
                    temp.push(circ.dayDreams[i]);
                    // console.log("pushing: " + circ.dayDreams[i]);
                }
            }
    
            Circle.findOneAndUpdate({ _id: req.body.circleID }, {
                $set:
                {
                    dayDreams: temp,
                }
            }).then(() => {
                res.status(200).send({ message: "Daydream Removed!" })
                return;
            }
            */
    })

})


/*
*   Add lodging
*/
router.post('/add-lodging', authenticate, (req, res) => {


    if (!req.body || !req.body.daydreamID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findOne({ _id: req.body.daydreamID }).then((daydream) => {
        if (!daydream) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        console.log(req.body)
        DayDream.findOneAndUpdate({ _id: req.body.daydreamID }, {
            $push: {
                lodgingInformation: {
                    address: req.body.address,
                    cost: req.body.cost,
                    user: req.user.username
                }
            }
        }).then((dd) => {
            res.status(200).send({ message: "Lodging added" })
            return;
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })


    })
})



module.exports = router;
