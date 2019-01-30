const bcrypt = require('bcrypt');

var encrypt = function (password) {
    return new Promise(function (resolve, reject) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password.toString(), salt, (err, hash) => {
                if (hash) {
                    resolve(hash)
                }
                else {
                    reject(err)
                }
            });
        });
    });
}

module.exports = encrypt;