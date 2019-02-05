var User = require('../model/user')
var Circle = require('../model/circle')
var Daydream = require('../model/daydream')

Daydream.deleteMany({}).then(() => {
    Circle.deleteMany({}).then(() => {
        User.deleteMany({}).then(() => {
            console.log("All database entries have been deleted")
        })
    })
})