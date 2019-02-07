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

router.post('/add', authenticate, (req, res) => {
    if (!req.body || !req.body.circleID || !req.body.destination || !req.body.description || !req.body.cost) {
        res.status(400).send({ message: "DayDream data is incomplete" });
        return;
    }
    var newDayDream = new DayDream({
        circleID: req.body.circleID,
        destination: req.body.destination,
        description: req.body.description,
        totalCost: req.body.cost,
    })

    Circle.findOneAndUpdate({_id: req.body.circleID}, {
      $push:{
        dayDreams: req.body.circleID
      }
    }).then((circ) => {
      if(circ ==null){
        //no circle found{}
        res.status(400).send({ message: "Circle doesn't exist" });
        return;
      }
      newDayDream.save().then(() => {
          res.status(200).send(newDayDream)
          return
      }).catch((err) => {
          res.status(400).send(err)
          return;
      })
      //works
    }).catch((err) => {
      res.send(err);
      return;
    })


})

router.get('/info', authenticate, (req, res) => {

    //ensure that request has body and has circleID
    //if not, send bad request
    if (!req.headers.circleid) {
        console.log(req.headers)
        res.status(400).send({ message: "Bad request" });
        return;
    }
    Circle.findById(req.headers.circleid, (err, circ) => {

        if (err) {
            res.status(400).send({ message: "Could not find daydream" });
            return;
        }
        res.status(200).send(circ) //returns all circle properties
        console.log("success in returning circle properties");
    }).catch((err) => {
        res.status(400).send(err);
        return;
    })
    //to get circle info of a specific circle
    //use ID

    // make sure ID
    })

module.exports = router;
