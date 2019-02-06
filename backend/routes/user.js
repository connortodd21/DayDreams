var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var encrypt = require('../middleware/encrypt')
var bcrypt = require('bcrypt')
var authenticate = require('../middleware/authenticate')
var mailer = require('../middleware/mailer')

mongoose.connect(process.env.MONGODB_HOST, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/* Objects */
var User = require('../model/user');
var Circle = require('../model/circle')

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
    if (!req.body.email || !req.body.password || !req.body.username) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    // Create a verification code between 1000 and 9999
    var verificatonCode = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    encrypt(req.body.password).then((password) => {
        // User Data
        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: password,
            verified: false,
            verificationNum: verificatonCode,
        });


        var newMemberEmailBody = "Dear " + req.body.username +
            ",\n\nWelcome to DayDreams! We ask you to please verify your account with us. Your verification code is:\n" +
            verificatonCode + "\nWe look forward to having you with us!\n\nSincerely, \nThe DayDreams Team";
        var newMemberEmailSubject = "Welcome to DayDreams!"

        // Add to database with auth
        newUser.save().then(() => {
            return newUser.generateAuth().then((token) => {

                res.header('verificationNum', verificatonCode).send(newUser);
                mailer(req.body.email, newMemberEmailSubject, newMemberEmailBody);
                return
            });
        }).catch((err) => {
            if (err.code == 11000) {
                res.status(400).send({ message: "User already exists" })
                return
            }
            res.status(400).send(err)
            return;
        })
    })
});

router.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).send({ message: "Bad request" })
        return;
    }

    User.findOne({ username: req.body.username }).then((user) => {

        if (!user) {
            res.status(400).send({ message: "Error: User does not exist, register before logging in" })
            return
        }
        // if (!user.verified) {
        //     res.status(401).send({ message: "User is not verified" })
        //     return;
        // }
        bcrypt.compare(req.body.password, user.password, function (err, comp) {
            if (comp == false) {
                res.status(400).send({ message: "Error: Password is incorrect" })
                return
            }
            else {
                user.generateAuth().then((token) => {
                    res.status(200).header('token', token).send(user)
                    return
                })
            }
        })
    }).catch((err) => {
        res.status(400).send(err)
        return
    })
})


/**
 * Verify new user's email
 */
router.post("/verify-email", (req, res) => {
    // Check if user data is complete
    // console.log("works")
    if (!req.body || !req.body.verificationNum || !req.body.email) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    // console.log(req.body.email)
    User.findVerificationNumByEmail(req.body.email).then((verificationNum) => {
        // Check if user has entered in the correct verification number
        if (verificationNum != req.body.verificationNum) {
            res.status(400).send({ message: "Verification code does not match" });
            return;
        }
        else {
            User.findOneAndUpdate({ email: req.body.email }, { $set: { verified: true } }).then(() => {
                res.status(200).send({ message: "User has been succesfully verified" });
            }).catch((err) => {
                res.status(400).send({ message: "An error has occoured with verifying your account" });
                res.send(err);
            });
        }
    }).catch((err) => {
        res.status(400).send({ message: "Email does not exist in our records" });
    });

})


/**
 * Reset Password
 */
router.post("/forgot-password", (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({ message: "Reset information is incomplete" });
        return;
    }
    // Find user by email
    if (req.body.email) {
        User.findByEmail(req.body.email).then((usr) => {
            var tempPassword = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            var email_subject = "DayDreams Password Reset";
            var email_body = "Dear " + usr.email + ", \n\nOur records indicate that you have requested a password " +
                "reset. Your new temporary password is:\n\n" +
                tempPassword + "\n\nSincerely, \n\nThe DayDreams Team";
            // find user by email and set temp password
            encrypt(tempPassword).then(encryptedPassword => {
                User.findOneAndUpdate({ email: usr.email }, { $set: { password: encryptedPassword } }).then(() => {
                }).catch((err) => {
                    res.status(400).send({ message: "New password not set." });
                    res.send(err);
                });
            }).catch(err => {
                console.log("err: " + err)
            });
            // Send email to user
            mailer(usr.email, email_subject, email_body);
            res.status(200).send({ message: 'Password has successfully been reset.' });
        }).catch((err) => {
            res.status(400).send({ message: "Email does not exist in our records." });
            console.log(err)
            return;
        });
    }
})


/**
 * Edit a user's email
 */
router.post("/change-email", authenticate, (req, res) => {
    if (!req.body || !req.body.email) {
        res.status(400).send({ message: "User data is incomplete" });
        return;
    }

    User.findOneAndUpdate({ username: req.user.username },
        {
            $set: {
                email: req.body.email
            }
        }).then(() => {
            res.status(200).send({ message: 'User email successfully updated' })
        }).catch((err) => {
            res.status(400).send({ message: "Error changing email" });
            res.send(err);
        })
})

router.get('/all-circles', authenticate, (req, res) => {
    Circle.find({ members: req.user.username }).then((circle) => {
        res.status(200).send(circle)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

module.exports = router;