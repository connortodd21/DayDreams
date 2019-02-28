var User = require('../model/user.js');

var authenticate = (req, res, next) =>{
    var token = req.header('token');

    User.findByToken(token).then((user) =>{
        if (!user){
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((err) =>{
        // console.log(token)
        res.status(401).send({message: '401 ERROR: Access Denied'});
    })
}

module.exports = authenticate;