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

    Circle.findOne({ _id: req.body.circleID }).then((circ) => {
        if (!circ) {
            res.status(400).send({ message: "Circle not found" });
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
        console.log(res)
        if (err || !dream) {
            res.status(400).send({ message: "Could not find Dream" });
            return;
        }
        console.log(dream)
        // console.log(circ)
        Circle.findByIdAndUpdate(dream.circleID, (err), {
            $pull: {
                dayDreams: req.body.daydreamID
            }
        }).then(() => {
            res.status(200).send({ message: "Daydream removed" }) //returns all circle properties
            console.log(dream);
            return
        })
    }).catch((err) => {
        res.status(400).send(err);
        return;
    })
})

/*
*   Add lodging information
*/
router.post('/add-lodging', authenticate, (req, res) => {


    if (!req.body || !req.body.daydreamID || !req.body.address || !req.body.cost || !req.user.username) {
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

/*
*   Edit lodging information
*/
router.post('/edit-lodging', authenticate, (req, res) => {
    if (!req.body || !req.body.daydreamID || !req.body.lodgingInformationID|| !req.body.address || !req.body.cost || !req.user.username) {
        res.status(400).send({ message: "Incomplete" });
        return;
    }
    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }

        var i = 0;
        for (i = 0; i < dd.lodgingInformation.length; i++){
            if (dd.lodgingInformation[i]._id == req.body.lodgingInformationID){
                dd.lodgingInformation[i].address = req.body.address;
                dd.lodgingInformation[i].cost = req.body.cost;
                dd.lodgingInformation[i].username = req.body.username;
                break;
            }
            if (dd.lodgingInformation[i]._id != req.body.lodgingInformationID){
                if(i == dd.lodgingInformation.length-1){
                    res.status(400).send({ message: "Lodging does not exist" });
                    return;
                }
            }
        }
        console.log(dd.lodgingInformation);
        var temp = dd.lodgingInformation
        DayDream.findOneAndUpdate({_id: req.body.daydreamID}, {
            $set:{
                lodgingInformation: temp
            },
        }).then(() => {
            res.status(200).send({ message: 'Lodging Information Updated' })
        }).catch((err) => {
            res.status(400).send({ message: "Error Lodging Information" });
                console.log(err)
                res.send(err);
        })
    })
})

/*
*   Delete lodging information
*/
router.post('/delete-lodging', authenticate, (req, res) => {
    if (!req.body || !req.body.daydreamID || !req.body.lodgingInformationID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    DayDream.findOne({_id: req.body.daydreamID }).then((dd)=>{
        if (!dd){
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        console.log("test")

        var i = 0;
        let temp = [];
        let tf = false;
        let tempIndex = 0;
        for (i = 0; i < dd.lodgingInformation.length; i++){
            if (dd.lodgingInformation[i]._id != req.body.lodgingInformationID){
                console.log(dd.lodgingInformation.length)
                console.log(i)
                temp[tempIndex++] = dd.lodgingInformation[i];
            }
            else{
                tf = true;
            }
        }
        if(!tf){
            res.status(400).send({ message: "Lodging does not exist" });
            return;
        }
        console.log("Temp: " + temp);
        DayDream.findOneAndUpdate({_id: req.body.daydreamID}, {
            $set:{
                lodgingInformation: temp
            },
        }).then(() => {
            res.status(200).send({ message: 'Lodging Information Successfully Deleted' })
        }).catch((err) => {
            res.status(400).send({ message: "Error Lodging Information" });
                console.log(err)
                res.send(err);
        })
    })

})

/*
*   Add travel information
*/
router.post('/add-travel', authenticate, (req, res) => {

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
                travelInformation: {
                    mode: req.body.mode,
                    cost: req.body.cost,
                    user: req.user.username
                }
            }
        }).then((dd) => {
            res.status(200).send({ message: "Travel information added" })
            return;
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})


/*
*   Edit travel information
*/
router.post('/edit-travel', authenticate, (req, res) => {
    if (!req.body || !req.body.daydreamID || !req.body.travelInformationID|| !req.body.mode || !req.body.cost || !req.user.username) {
        res.status(400).send({ message: "Incomplete" });
        return;
    }
    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }

        var i = 0;
        for (i = 0; i < dd.travelInformation.length; i++){
            if (dd.travelInformation[i]._id == req.body.travelInformationID){
                dd.travelInformation[i].mode = req.body.mode;
                dd.travelInformation[i].cost = req.body.cost;
                dd.travelInformation[i].username = req.body.username;
                break;
            }
            if (dd.travelInformation[i]._id != req.body.travelInformationID){
                if(i == dd.travelInformation.length-1){
                    res.status(400).send({ message: "Travel Information does not exist" });
                    return;
                }
            }
        }
        console.log(dd.travelInformation);
        var temp = dd.travelInformation
        DayDream.findOneAndUpdate({_id: req.body.daydreamID}, {
            $set:{
                travelInformation: temp
            },
        }).then(() => {
            res.status(200).send({ message: "Travel Information Updated" })
        }).catch((err) => {
            res.status(400).send({ message: "Error Lodging Information" });
                console.log(err)
                res.send(err);
        })
    })
})

/*
*   Delete travel information
*/
router.post('/delete-travel', authenticate, (req, res) => {
    if (!req.body.daydreamID || !req.body.travelInformationID) {
        res.status(400).send({ message: "Bad request" });
        return;
    }

    DayDream.findOne({_id: req.body.daydreamID }).then((dd)=>{
        if (!dd){
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        console.log("test")

        var i = 0;
        let temp = [];
        let tf = false;
        let tempIndex = 0;
        for (i = 0; i < dd.travelInformation.length; i++){
            if (dd.travelInformation[i]._id != req.body.travelInformationID){
                console.log(dd.travelInformation.length)
                console.log(i)
                temp[tempIndex++] = dd.travelInformation[i];
            }
            else{
                tf = true;
            }
        }
        if(!tf){
            res.status(400).send({ message: "Travel Information does not exist" });
            return;
        }
        console.log("Temp: " + temp);
        DayDream.findOneAndUpdate({_id: req.body.daydreamID}, {
            $set:{
                travelInformation: temp
            },
        }).then(() => {
            res.status(200).send({ message: 'Travel Information Successfully Deleted' })
        }).catch((err) => {
            res.status(400).send({ message: "Error Travel Information" });
                console.log(err)
                res.send(err);
        })
    })
})

router.post('/upload-photo', authenticate, upload.single("image"), (req, res) => {
    // console.log(req)
    if (!req.file.url || !req.file.public_id || !req.headers.daydreamid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findOne({ _id: req.headers.daydreamid }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
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
    }).catch((err) => {
        res.send(err);
    })
})

router.post("/edit-destination", authenticate, (req, res) => {
    if (!req.body.destination || !req.body.daydreamID) {
        res.status(400).json({ message: "Daydream change is incomplete" });
        return;
    }

    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
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
})

router.post("/edit-description", authenticate, (req, res) => {
    if (!req.body.description || !req.body.daydreamID) {
        res.status(400).json({ message: "Daydream change is incomplete" });
        return;
    }

    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        DayDream.findOneAndUpdate({ _id: req.body.daydreamID },
            {
                $set: {
                    description: req.body.description,
                }
            }).then(() => {
                res.status(200).send({ message: 'Circle name updated!' })
                return
            }).catch((err) => {
                res.send(err);
            })
    })
})

router.post("/edit-cost", authenticate, (req, res) => {
    if (!req.body.totalCost || !req.body.daydreamID) {
        res.status(400).json({ message: "Daydream change is incomplete" });
        return;
    }

    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        DayDream.findOneAndUpdate({ _id: req.body.daydreamID },
            {
                $set: {
                    totalCost: req.body.totalCost,
                }
            }).then(() => {
                res.status(200).send({ message: 'Circle name updated!' })
                return
            }).catch((err) => {
                res.send(err);
            })
    })
})

router.post('/add-to-memories', authenticate, (req, res) => {
    if (!req.body.daydreamID) {
        res.status(400).json({ message: "Daydream change is incomplete" });
        return;
    }
    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        DayDream.findOneAndUpdate({ _id: req.body.daydreamID }, {
            $set: {
                completed: true
            }
        }).then(() => {
            res.status(200).send({ message: 'DayDream added to memories' })
            return
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})

router.post('/remove-from-memories', authenticate, (req, res) => {
    if (!req.body.daydreamID) {
        res.status(400).json({ message: "Daydream change is incomplete" });
        return;
    }
    DayDream.findOne({ _id: req.body.daydreamID }).then((dd) => {
        if (!dd) {
            res.status(400).send({ message: "Daydream does not exist" });
            return;
        }
        DayDream.findOneAndUpdate({ _id: req.body.daydreamID }, {
            $set: {
                completed: false
            }
        }).then(() => {
            res.status(200).send({ message: 'DayDream removed from memories' })
            return
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})

router.post('/add-contribution', authenticate, (req ,res) => {
    if(!req.body.daydreamID || !req.body.cost){
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findById(req.headers.daydreamid, (err, dd) => {

        if (err) {
            res.status(400).send({ message: "Could not find daydream" });
            return;
        }
        DayDream.findOneAndUpdate({_id: req.body.daydreamID}, {
            $push:{
                individualContribution: {
                    user: req.user.username,
                    money: req.body.cost
                }
            }
        }).then(() => {
            res.status(200).send({ message: 'Contribution Added' })
            return
        }).catch((err) => {
            res.send(err);
        })
    }).catch((err) => {
        res.send(err);
    })
})

router.get('/all-contributions', authenticate, (req, res) => {
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
        res.status(200).send(dd.individualContribution)
        return
    })
})

router.get('/sum', authenticate, (req, res) => {
    if (!req.headers.daydreamid) {
        // console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findById(req.headers.daydreamid, (err, dd) => {
        console.log(dd)
        if (err || !dd) {
            res.status(400).send({ message: "Could not find daydream" });
            return;
        }
        DayDream.aggregate([
            {
                $unwind: "$individualContribution"
            },
            {
                $group: {
                    _id: null,
                    TotalBalance:{$sum:"$individualContribution.money"}
                }
            }
        ]).then((daydream) => {
            console.log(daydream)
            res.status(200).send(daydream)
        })
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
        return
    })
    //to get circle info of a specific circle
    //use ID

    // make sure ID
})


/*
*   Get lodging info
*/
router.get('/get-lodging', authenticate, (req, res) => {

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
        res.status(200).send(dd.lodgingInformation)
        console.log(dd.lodgingInformation);
        return
    })
})

/*
*   Get travel info
*/
router.get('/travel', authenticate, (req, res) => {

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
        res.status(200).send(dd.travelInfortmation)
        console.log(dd.travelInfortmation);
        return
    })
})

router.get('/all-photos', authenticate, (req, res) => {
    if (!req.headers.daydreamid) {
        res.status(400).send({ message: "Bad request" });
        return;
    }
    DayDream.findById(req.headers.daydreamid, (err, dd) => {

        if (err) {
            res.status(400).send({ message: "Could not find daydream" });
            return;
        }
        res.status(200).send(dd.images) //returns all circle properties
        return
        // console.log(dd.images)
    }).catch((err) => {
        res.status(400).send(err);
        return;
    })
})



module.exports = router;
